

export const view: ViewHandler = () => `
<div>
  <span>__  __  _____   __    _   _     __   _   ___   __  __ </span>
  <span>\\ \\ \\ \\  | |   / /\\  | | | |   ( (\` | | | |_) / / / / </span>
  <span>/_/ /_/  |_|  /_/--\\ |_| |_|__ _)_) |_| |_|   \\_\\ \\_\\ </span>
  <span> </span>
</div>
`

export const style: StyleHandler = () => `
$>span {
  display: block;
  font-family: "Roboto Mono", mono, monospace;
  white-space: pre;
  line-height: 1.2;
}
`