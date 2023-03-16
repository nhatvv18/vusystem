namespace VU.SeverSystem.Utils.Validations
{
    public class RandomNumberUtils
    {
        public static string RandomNumber(int length)
        {
            Random random = new Random();
            const string chars = "0123456789";
            return new string(Enumerable.Repeat(chars, length)
                .Select(s => s[random.Next(s.Length)]).ToArray());
        }

    }
}
