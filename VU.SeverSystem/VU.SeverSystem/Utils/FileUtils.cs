using System.Text.RegularExpressions;
using System.Web;

namespace VU.SeverSystem.Utils
{
    public static class FileUtils
    {
        private static Dictionary<string, string> GetParams(string uri)
        {
            var matches = Regex.Matches(uri, @"[\?&](([^&=]+)=([^&=#]*))", RegexOptions.Compiled);
            var dic = matches.Cast<Match>().ToDictionary(
                m => Uri.UnescapeDataString(m.Groups[2].Value),
                m => Uri.UnescapeDataString(m.Groups[3].Value)
            );
            foreach (var d in dic)
            {
                dic[d.Key] = HttpUtility.UrlDecode(d.Value);
            }
            return dic;
        }
        public static GetFullPathResultDto GetFullPathFile(string pathDb, string filePath)
        {
            var path = GetParams(pathDb);
            var folder = path["folder"];
            var fileName = path["file"];

            var fullPath = Path.Combine(filePath, folder, fileName);
            return new GetFullPathResultDto
            {
                FileName = fileName,
                Folder = folder,
                FullPath = fullPath
            };
        }

        public class GetFullPathResultDto
        {
            public string FullPath { get; set; }
            public string FileName { get; set; }
            public string Folder { get; set; }
        }
    }
}
