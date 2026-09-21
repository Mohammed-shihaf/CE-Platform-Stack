import { Request, Response } from 'express';
import { exec } from 'child_process';

export class DiagnosticsController {
  /**
   * System ping utility
   * INTENTIONAL SAST BENCHMARK FIXTURE: CWE-78 OS Command Injection
   */
  public pingHost(req: Request, res: Response): void {
    const target = (req.query.host as string) || '127.0.0.1';
    
    exec(`ping -c 1 ${target}`, (error, stdout, stderr) => {
      if (error) {
        return res.status(500).json({ error: error.message, stderr });
      }
      res.json({ output: stdout });
    });
  }
}
