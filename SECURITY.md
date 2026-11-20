# Security

SleepRings runs inside Home Assistant and handles sleep and heart-rate data, so
reports of security or privacy problems are taken seriously.

## Reporting a problem

Please do not open a public issue for a vulnerability. Use GitHub's private
reporting instead: on this repository, go to **Security > Report a
vulnerability**. You should get a first reply within a week.

Useful to include: the SleepRings and Home Assistant versions, what an attacker
needs (a login, a crafted entity, a pasted card configuration), and what they
gain.

## What SleepRings does and does not do

- It makes no network requests. It only reads data that another integration
  already holds in your Home Assistant.
- Its dashboard card is one JavaScript file served by Home Assistant itself;
  it loads nothing from elsewhere.
- Its diagnostics download leaves out sleep times, bedtimes, heart rate, time
  zone and entity ids.

See "Privacy" in the README for where your data is stored and who can read it.
