import { Router, Request, Response } from 'express';
import { exec } from 'child_process';

const router = Router();

/**
 * Diagnostics Endpoint
 * SAST CWE-78: Command injection flaw via unescaped host parameter
 */
router.get('/ping', (req: Request, res: Response) => {
  const host = req.query.host as string || 'localhost';
  exec(`ping -c 1 ${host}`, (err, stdout) => {
    res.json({ output: stdout || 'Diagnostic complete' });
  });
});

export { router as diagnosticsRouter };
