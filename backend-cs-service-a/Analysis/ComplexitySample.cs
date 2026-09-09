namespace BackendCsServiceA.Analysis
{
    public class ComplexitySample
    {
        public static int ProcessComplexRules(int category, string tier, bool isActive, int quantity)
        {
            int score = 0;
            if (isActive)
            {
                if (tier == "gold")
                {
                    if (category == 1) score += 50;
                    else if (category == 2) score += 40;
                    else score += 30;
                }
                else if (tier == "silver")
                {
                    if (category == 1) score += 25;
                    else score += 15;
                }
                else
                {
                    score += 5;
                }

                for (int i = 0; i < quantity; i++)
                {
                    if (i % 2 == 0) score += 2;
                    else score += 1;
                }
            }
            else
            {
                score = -1;
            }
            return score;
        }
    }
}
