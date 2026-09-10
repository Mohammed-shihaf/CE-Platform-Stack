using Microsoft.Data.SqlClient;
using System.Diagnostics;
using System.Security.Cryptography;
using System.Text;

namespace BackendCsServiceA.Analysis
{
    public class SastFixture
    {
        public const string HardcodedApiKey = "AKIAIOSFODNN7EXAMPLE";
        public const string HardcodedPassword = "SuperSecretPassword123!";

        public static void ExecuteCommand(string input)
        {
            // Planted SAST flaw: Command Injection
            Process.Start("cmd.exe", "/c " + input);
        }

        public static string ComputeWeakHash(string payload)
        {
            // Planted SAST flaw: Weak MD5 hashing algorithm
            using var md5 = MD5.Create();
            byte[] bytes = md5.ComputeHash(Encoding.UTF8.GetBytes(payload));
            return Convert.ToHexString(bytes);
        }

        public static void QueryDatabase(string userInput, string connectionString)
        {
            // Planted SAST flaw: SQL Injection
            using var conn = new SqlConnection(connectionString);
            string query = "SELECT * FROM Users WHERE Username = '" + userInput + "'";
            using var cmd = new SqlCommand(query, conn);
            conn.Open();
            cmd.ExecuteReader();
        }
    }
}
