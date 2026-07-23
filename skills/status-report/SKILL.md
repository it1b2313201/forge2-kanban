name: status-report
description: Post a concise status update to Slack in exactly three sections: What I Did, What's Left, and What Needs Your Call.
trigger:
  - status update
  - status report
  - what is the status
run:
  steps:
    - Gather completed work and recent progress.
    - List remaining tasks and the current plan.
    - Identify decisions or approvals needed from the human.
instructions:
  - Reply in exactly three sections with these headings:
    - What I Did
    - What's Left
    - What Needs Your Call
  - Keep the update short, clear, and actionable.
