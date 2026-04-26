// Types
import type { MouseEventHandler } from "react";

export const UiButton = (props: {
  text: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  disabled?: boolean;
}) => {
  const { text, disabled, onClick } = props;
  return (
    <button className="ui-button" onClick={onClick} disabled={disabled}>
      <span>{text}</span>
    </button>
  );
};

export default UiButton;
