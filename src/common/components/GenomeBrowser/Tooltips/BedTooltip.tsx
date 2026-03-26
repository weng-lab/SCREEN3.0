import { Rect } from "@weng-lab/genomebrowser";

export default function BedTooltip(props: Rect) {
  return (
    <div
      style={{ fontSize: "10px", backgroundColor: "white", padding: "5px", boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)" }}
    >
      <div>{props.name}</div>
    </div>
  );
}
