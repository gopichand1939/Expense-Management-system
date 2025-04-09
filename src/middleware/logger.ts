// ✅ Logs every action into logs/audit.log with timestamp, role, and email

import fs from 'fs';
import path from 'path';
import { Request, Response, NextFunction } from 'express';

const logFile = path.join(__dirname, '../../logs/audit.log');

export const auditLogger = (action: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;
    const log = `[${new Date().toISOString()}] ${user?.role} (${user?.email}) -> ${action} ${req.method} ${req.originalUrl}\n`;

    fs.appendFileSync(logFile, log, 'utf8');
    next();
  };
};
