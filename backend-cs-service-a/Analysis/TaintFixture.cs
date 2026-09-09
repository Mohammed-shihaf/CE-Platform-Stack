namespace BackendCsServiceA.Analysis
{
    public class TaintFixture
    {
        public static void RunTaintSinkFromEnvironment()
        {
            string? untrustedEnv = Environment.GetEnvironmentVariable("UNTRUSTED_INPUT");
            if (!string.IsNullOrEmpty(untrustedEnv))
            {
                // Taint sink
                SastFixture.ExecuteCommand(untrustedEnv);
            }
        }
    }
}
