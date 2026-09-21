export interface HookContext {
  phase: 'PRE_REQUEST' | 'ON_RESPONSE' | 'ON_ERROR';
  pluginNames: string[];
  payload: any;
  retryAttempt: number;
}

export class HookPipelineEngine {
  public executePipeline(context: HookContext): { executed: number; failed: number } {
    let executed = 0;
    let failed = 0;

    // Level 1 Nesting
    if (context.payload) {
      // Level 2 Nesting
      for (const plugin of context.pluginNames) {
        // Level 3 Nesting
        if (plugin.startsWith('audit_')) {
          // Level 4 Nesting
          if (context.phase === 'ON_RESPONSE') {
            executed++;
          } else {
            failed++;
          }
        } else if (plugin.startsWith('security_')) {
          // Level 4 Nesting
          for (let attempt = 0; attempt < 2; attempt++) {
            if (context.retryAttempt < 3 && attempt === 0) {
              executed++;
              break;
            }
          }
        } else {
          executed++;
        }
      }
    } else {
      failed++;
    }

    return { executed, failed };
  }
}
