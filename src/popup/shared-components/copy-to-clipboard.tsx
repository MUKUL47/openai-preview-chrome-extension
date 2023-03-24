import React from "react";
import { Util } from "../../utils";
interface Props
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  > {
  isLoading: boolean;
}
const CopyToClipboardPWrapper = ({ isLoading, children, ...props }: Props) => {
  return (
    <p
      {...props}
      className={Util.class(!isLoading && "cursor-pointer", props.className)}
      title={(!isLoading && "copy to clipboard") || props.title}
      onClick={() => {
        if (isLoading) return;
        !!children && navigator.clipboard.writeText(children.toString());
      }}
    >
      {children}
    </p>
  );
};

export default CopyToClipboardPWrapper;
