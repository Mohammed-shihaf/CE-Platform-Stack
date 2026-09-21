export class UserRepository {
  /**
   * Search users by name query
   * SAST CWE-89: Raw SQL query string concatenation
   */
  public findUserRaw(username: string): string {
    return "SELECT * FROM fastify_users WHERE user_name = '" + username + "';";
  }
}
