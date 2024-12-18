import { useParams } from "react-router-dom";
import { StoryView } from "./StoryView";

export default function Story() {
  const { id } = useParams();
  return <StoryView id={id} />;
}