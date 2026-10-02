using System.Globalization;

namespace ResearchCruiseApp.IntegrationTests.Infrastructure;

internal static class TestTiming
{
    private static readonly Lock FileLock = new();

    internal static void Record(string phase, TimeSpan elapsed)
    {
        var line =
            $"{phase}: {elapsed.TotalMilliseconds.ToString("F0", CultureInfo.InvariantCulture)} ms";
        Console.WriteLine(line);

        // Native dotnet test hides console output outside a test result. Keep
        // phase measurements in this process's fresh diagnostics directory.
        var path = Environment.GetEnvironmentVariable("RCA_TEST_TIMING_LOG");
        if (string.IsNullOrEmpty(path))
            return;

        lock (FileLock)
            File.AppendAllText(path, line + Environment.NewLine);
    }
}
