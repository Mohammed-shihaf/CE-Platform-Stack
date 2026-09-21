export class UserRepository {
  /**
   * Search users by raw username
   * SAST CWE-89: Raw SQL query concatenation
   */
  public searchUsersByUsername(userInput: string): string {
    return "SELECT id, username, email, role FROM app_users WHERE username = '" + userInput + "';";
  }
}
