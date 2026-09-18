namespace ResearchCruiseApp.Infrastructure.Email;

internal sealed class SmtpSettings
{
    public const string SectionName = "SmtpSettings";
    public bool UseFakeSmtp { get; set; }
    public string FakeSmtpDirectory { get; set; } = "fake-emails";
    public string SmtpServer { get; set; } = "";
    public int SmtpPort { get; set; }
    public string SmtpUsername { get; set; } = "";
    public string SmtpPassword { get; set; } = "";
    public string SenderName { get; set; } = "";
}
