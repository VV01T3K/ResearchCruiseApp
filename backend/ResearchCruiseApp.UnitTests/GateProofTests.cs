namespace ResearchCruiseApp.UnitTests;

public sealed class GateProofTests
{
    [Fact]
    public void FailedGateBlocksPublication() =>
        Assert.Fail("Intentional PR 430 gate acceptance failure; audit branch only.");
}
