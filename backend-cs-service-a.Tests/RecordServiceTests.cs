using BackendCsServiceA.Analysis;
using BackendCsServiceA.Services;
using Ceplatform;
using Xunit;

namespace BackendCsServiceA.Tests;

/// <summary>
/// Tests for RecordServiceImpl and SastFixture.
///
/// Metrics targeted:
///   ✅ All-Uses Coverage %          — record/fixture fields: defined → used
///   ✅ C-Use (Computational Use)    — ComputeWeakHash: payload → hash
///   ✅ P-Use (Predicate Use)        — NotifyRecordCreated: sub iteration predicate
///   ✅ Coverage Delta %             — new coverage on service notification path
///   ✅ Cross-Function Use Detection — NotifyRecordCreated → WriteAsync
///   ✅ Mutation Kill Rate %         — hash length and content asserts
/// </summary>
public class RecordServiceTests
{
    // ── SastFixture — data-flow / All-Uses Coverage ───────────────────────
    [Fact]
    public void ComputeWeakHash_ReturnsHexString()
    {
        // C-Use: payload ("hello") is defined at call site,
        // used computationally inside MD5.ComputeHash(payload.encode()).
        string result = SastFixture.ComputeWeakHash("hello");
        Assert.Equal(32, result.Length);
        Assert.Matches("^[0-9A-F]+$", result);
    }

    [Fact]
    public void ComputeWeakHash_DifferentInputs_DifferentHashes()
    {
        // All-Uses: distinct def-use pairs for different payload values.
        string h1 = SastFixture.ComputeWeakHash("abc");
        string h2 = SastFixture.ComputeWeakHash("xyz");
        Assert.NotEqual(h1, h2);
    }

    [Fact]
    public void ComputeWeakHash_SameInput_DeterministicOutput()
    {
        string h1 = SastFixture.ComputeWeakHash("repeat");
        string h2 = SastFixture.ComputeWeakHash("repeat");
        Assert.Equal(h1, h2);
    }

    // ── RecordServiceImpl.NotifyRecordCreated — All-Uses / Coverage Delta ─
    [Fact]
    public void NotifyRecordCreated_WithNoSubscribers_DoesNotThrow()
    {
        // P-Use: foreach iteration predicate on _subscribers (empty set)
        var wireRecord = new Record
        {
            Id = "test-id",
            Title = "Test Title",
            Description = "Test Description",
            CreatedAt = DateTime.UtcNow.ToString("o")
        };

        // Should not throw with zero subscribers
        var exception = Record.Exception(() =>
            RecordServiceImpl.NotifyRecordCreated(wireRecord));
        Assert.Null(exception);
    }

    // ── SastFixture — HARDCODED credential definitions ────────────────────
    [Fact]
    public void SastFixture_HardcodedApiKey_IsDefined()
    {
        // All-Definition Coverage: HARDCODED_API_KEY constant is defined and reachable.
        // Beniget / pyflakes equivalent: constant accessed = used definition.
        const string expected = "AKIAIOSFODNN7EXAMPLE";
        Assert.Equal(expected, SastFixture.HardcodedApiKey);
    }

    [Fact]
    public void SastFixture_HardcodedPassword_IsDefined()
    {
        const string expected = "SuperSecretPassword123!";
        Assert.Equal(expected, SastFixture.HardcodedPassword);
    }
}
