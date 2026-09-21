export class AuthServiceClient {
  private authBaseUrl: string;

  constructor(authBaseUrl: string = process.env.AUTH_SERVICE_URL || 'http://localhost:4001') {
    this.authBaseUrl = authBaseUrl;
  }

  public async verifyPermission(userId: string, role: string, resource: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.authBaseUrl}/api/auth/evaluate-role`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          role,
          requestedResource: resource,
          accessLevel: 'WRITE'
        })
      });
      if (!response.ok) return false;
      const data: any = await response.json();
      return data?.result?.granted || false;
    } catch {
      return false;
    }
  }
}
