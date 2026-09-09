namespace BackendCsServiceA.Analysis
{
    public class DeadCode
    {
        private static void UnusedPrivateMethod()
        {
            int unusedVariable = 42;
            Console.WriteLine($"Ghost function: {unusedVariable}");
        }

        public static void NeverCalledPublicMethod()
        {
            if (false)
            {
                Console.WriteLine("Unreachable branch");
            }
        }
    }
}
