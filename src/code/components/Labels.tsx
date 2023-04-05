const { widget } = figma
const { AutoLayout, SVG, Text} = widget
import { LinearIssue } from '../types'

function TextLabel ({ name, color}: { name: string, color: string}) {
  return (
    <AutoLayout
      spacing={4}
      strokeWidth={1}
      verticalAlignItems="center"
      horizontalAlignItems="center"
      stroke="#D9DBDF"
      cornerRadius={12}
      // width='fill-parent'
      padding={{ left: 8, right: 8, top: 2, bottom: 2 }}
    >
      <AutoLayout verticalAlignItems="center" horizontalAlignItems="center" width={9} height={9} cornerRadius={4} fill={color}/>
      <Text>{name}</Text>
    </AutoLayout>	
  )
}

export function Labels ({ labels }: { labels: LinearIssue['labels']}) {
  const nodes = labels?.nodes || [];
  const showLabelText = nodes.length < 4

  if (nodes.length === 0) return null
  if (!showLabelText) {
    return (
      <AutoLayout
        verticalAlignItems="center"
        horizontalAlignItems="center"
        spacing={4}
        fill="#fff"
        cornerRadius={12}
        padding={{ left: 4, right: 4}}
      >
        <AutoLayout
          verticalAlignItems="center"
          horizontalAlignItems="center"
          width={"fill-parent"}
          spacing={-4}
        
        >
          {
            nodes.map((label, index) => (
              <AutoLayout key={index} verticalAlignItems="center" horizontalAlignItems="center" width={9} height={9} cornerRadius={4} fill={label.color} stroke={'#fff'} strokeWidth={1}/>
            ))
          }
        </AutoLayout>
        <Text>{nodes.length} labels</Text>

      </AutoLayout>
    )
  }
  return (
    <AutoLayout
      verticalAlignItems="center"
      width="fill-parent"
      spacing={8}
    >
      {
        nodes.map((label, index) => (
         <TextLabel key={index} {...label} />
        ))
      }
    </AutoLayout>
  )
}