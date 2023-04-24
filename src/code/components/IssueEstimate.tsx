const { widget } = figma
const { AutoLayout, Text, SVG } = widget 
import { LinearIssue } from "../types";
import { EstimateIcon } from "./icons"

interface IssueEstimateProps {
  estimate: number | null;
  type: LinearIssue['team']['issueEstimationType'];
}

const tshirtSizeMap = {
  0: 'Not Estimated',
  1: 'XS',
  2: 'S',
  3: 'M',
  5: 'L',
  8: 'XL',
  13: 'XXL',
  21: 'XXXL',
}
export function IssueEstimate({ estimate, type }: IssueEstimateProps) {
  if (type === 'notUsed') return null

  const estimateText = type === 'tShirt' ? tshirtSizeMap[estimate] : `${estimate || 0} Point${estimate > 1 || !estimate ? 's' : ''}`
  return (
    <AutoLayout
      spacing={4}
    >
      <Text
        fill="#6b6f76"
        width={120}
      >
        Estimate:
      </Text>
      <AutoLayout
        verticalAlignItems="center"
        spacing={8}
      >
        <SVG width={14} height={14} src={EstimateIcon} />
        <Text>{estimateText}</Text>
      </AutoLayout>
    </AutoLayout>
  )
}