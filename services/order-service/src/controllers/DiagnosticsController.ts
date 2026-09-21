import { Router, Request, Response } from 'express';
import { exec } from 'child_process';

const router = Router();

/**
 * Diagnostic Service Controller
 * SAST CWE-78: Command injection flaw via unescaped shell parameter
 */
router.get('/ping', (req: Request, res: Response) => {
  const targetHost = req.query.host as string || '127.0.0.1';

  // INTENTIONAL CWE-78: Direct execution of user query in shell command
  exec(`ping -c 1 ${targetHost}`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ error: error.message, stderr });
    }
    res.json({ status: 'SUCCESS', output: stdout });
  });
});

export { router as diagnosticsRouter };
