import Runtime "mo:core/Runtime";

actor {
  var walletSetup = false;
  var autoLockTimeout : Nat = 10;
  var biometricsEnabled = false;

  public shared ({ caller }) func setWalletSetup(hasWallet : Bool) : async () {
    walletSetup := hasWallet;
  };

  public query ({ caller }) func hasWallet() : async Bool {
    walletSetup;
  };

  public shared ({ caller }) func setAutoLockTimeout(timeoutMinutes : Nat) : async () {
    if (timeoutMinutes == 0) { Runtime.trap("Timeout value should be greater than 0") };
    autoLockTimeout := timeoutMinutes;
  };

  public query ({ caller }) func getAutoLockTimeout() : async Nat {
    autoLockTimeout;
  };

  public shared ({ caller }) func setBiometricsEnabled(enabled : Bool) : async () {
    biometricsEnabled := enabled;
  };

  public query ({ caller }) func getBiometricsEnabled() : async Bool {
    biometricsEnabled;
  };
};
