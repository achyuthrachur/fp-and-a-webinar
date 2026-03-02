export const definitions = [
  "Close Cycle Time = max(task.completed_at) - min(period_start_date)",
  "On-Time Task Completion % = tasks completed by due date / total tasks * 100",
  "Late Journal Ratio % = late journals / total journals * 100",
  "Risk Composite Score = weighted_sum(normalized_indicator_scores)",
];
