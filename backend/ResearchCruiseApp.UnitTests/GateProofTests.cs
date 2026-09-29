namespace ResearchCruiseApp.UnitTests;

public sealed class GateProofTests
{
    [Fact]
    public void Gate_WhenTestFails_BlocksPublication() =>
        Assert.Fail("Intentional PR 430 gate acceptance failure; audit branch only.");
}
