import { GOVERNANCE_QUORUM } from "../constants/values";

export function proposalStatus(epoch, start, period, initialized, approve, reject, total): string {
  if (start === 0) {
    return "N/A";
  }
  if (epoch < start) {
    return "Unknown";
  }
  if (epoch < (start + period)) {
    return "Voting"
  }
  if (initialized) {
    return "Committed"
  }

  if (epoch < (start + period)) {
    return "Rejected"; // Not ended
  }
  if (approve.plus(reject).dividedBy(total).comparedTo(GOVERNANCE_QUORUM) < 0) {
    return "Rejected"; // Didn't meet quorum
  }
  return approve.comparedTo(reject) > 0 ? "Approved" : "Rejected";
}