const { widget } = figma
const { AutoLayout, Frame, Image, Fragment, Span, SVG, Text, Input, Ellipse, Line, useSyncedMap, useSyncedState, useEffect, waitForTask, useWidgetId } = widget

import { 
  CheckedCheckedBoxIcon,
  UncheckedCheckedBoxIcon,
  VideoIcon,
  FigmaIcon
} from "./components/icons"
import { LinearIssue } from "./types";
function incrementRomanNumeral(romanNumeral) {
  const romanSymbols = ['i', 'v', 'x', 'l', 'c', 'd', 'm'];
  const romanValues = [1, 5, 10, 50, 100, 500, 1000];

  let decimalValue = 0;
  for (let i = romanNumeral.length - 1; i >= 0; i--) {
    const symbol = romanNumeral[i];
    const value = romanValues[romanSymbols.indexOf(symbol)];
    const previousValue = romanValues[romanSymbols.indexOf(romanNumeral[i - 1])];

    if (value < previousValue) {
      decimalValue += previousValue - value;
      i--;
    } else {
      decimalValue += value;
    }
  }

  decimalValue++;

  let result = '';
  let remainder = decimalValue;

  for (let i = romanValues.length - 1; i >= 0; i--) {
    const value = romanValues[i];
    const symbol = romanSymbols[i];

    while (remainder >= value) {
      result += symbol;
      remainder -= value;
    }

    if (i % 2 === 0 && remainder >= value - romanValues[i - 2]) {
      result += romanSymbols[i - 2] + symbol;
      remainder -= value - romanValues[i - 2];
    }
  }

  return result;
}

function renderParagraphData(contentNode, index) {
  const isHeading = contentNode?.type === 'heading'
  const headingLevel = contentNode?.attrs?.level
  const textFontSize = isHeading ? 22 - (headingLevel - 1) * 2 : 16
  const paragraphNodes = (contentNode?.content || []).map((textNode, index) => {
    if (textNode.type === 'text') {
      const textEffects: { [elKey: string]: any } = {}
      if (textNode?.marks) {
        textNode.marks.forEach(mark => {
          if (mark.type === 'link') {
            textEffects.href = mark.attrs.href
            textEffects.fill = '#2161dc'
          }
          if (mark.type === 'strong') {
            textEffects.fontWeight = "bold"
          }
          if (mark.type === 'em') {
            textEffects.italic = true
          }
          if (mark.type === 'strike') {
            textEffects.textDecoration ='strikethrough'
          }
          if (mark.type === 'underline') {
            textEffects.textDecoration = 'underline'
          }
        })
      }
      // if text is empty, add a new line
      const text = textNode?.text ? textNode.text.toString() : '\n'
      return <Span key={index} {...textEffects}>{textNode.text.toString()}</Span>
    }
    if (textNode.type === 'emoji') {
      return <Span key={index}>{textNode?.attrs?.label}</Span>
    }
    if (textNode.type === "suggestion_userMentions") {
      return <Span key={index} fill="#282a30">@{textNode?.attrs?.label}</Span>
    }
    if (textNode.type === "issueMention") {
      return <Span key={index} fill="#2161dc" href={textNode?.attrs?.href}>{textNode?.attrs?.label}</Span>
    }
    return null
  }).filter(Boolean)
  return <Text key={`paragraph-${index}`} width={'fill-parent'} fontSize={textFontSize}>{paragraphNodes}</Text>
}

const getBulletItemText = (nestingLevel) => {
  switch (nestingLevel) {
    case 0:
      return <Text>&#8226;</Text>
    case 1:
      return <Text>&#9702;</Text>
    default: 
      return <Text>&#9642;</Text>

  }
}
const getListItemIndicator = (listNode, listType, nestingLevel, listIndex) => {
  switch (listType) {
    case 'ordered_list':
      return <Text>{nestingLevel === 0 ? listIndex + 1 : nestingLevel === 1 ? String.fromCharCode('a'.charCodeAt(0) + 1) : incrementRomanNumeral(listIndex) }.</Text>
    case 'bullet_list':
      return getBulletItemText(nestingLevel)
    case 'todo_list':
      return <SVG src={listNode?.attrs?.done ? CheckedCheckedBoxIcon : UncheckedCheckedBoxIcon}/>
    default:
      return <Text>&#8226;</Text>
  }
}
function renderListData(contentNode, nestingLevel = 0) {
  // bullet_list, todo_list, ordered_list
  const listType = contentNode.type
  
  const listNodes = contentNode.content.map((listNode, listIndex) => {
    const listNodeContent = listNode.content.map((listNodeChild, listNodeChildIndex) => {
     
      if (listNodeChild.type === 'paragraph') return <AutoLayout key={listNodeChildIndex} width={'fill-parent'} spacing={6} verticalAlignItems="center">{getListItemIndicator(listNode,  listType, nestingLevel, listIndex)}{renderParagraphData(listNodeChild, listIndex)}</AutoLayout>
      else {
        return <AutoLayout key={listIndex} width={'fill-parent'} direction="vertical" padding={{ left: 24}}>{renderListData(listNodeChild, nestingLevel + 1)}</AutoLayout>
      }
    }).filter(Boolean)

    return listNodeContent
  }).filter(Boolean)

  return <AutoLayout direction="vertical" padding={{ top: 0, bottom: 4, left: 8 }} width={'fill-parent'} spacing={8}>{listNodes}</AutoLayout>
}

export function prosemirrorToWidgetReact(linearIssue: LinearIssue, openLinearTicketURL: () => void) {
  try {
    const data = JSON.parse(linearIssue?.descriptionData)
    const children = data.content.map((contentNode, i) => {
      if (contentNode.type === 'paragraph') {
        return renderParagraphData(contentNode, i)
      }
      else if (contentNode.type === 'heading') {
        return renderParagraphData(contentNode, i)
      }
      else if (contentNode.type === 'figma') {
        return (
          <AutoLayout
            key={i}
            width={'fill-parent'}
            spacing={10}
            cornerRadius={4}
            fill="#fff"
            stroke={"#e1e4e8"}
            blendMode="normal"
            hoverStyle={{ opacity: 0.8 }}
            padding={16}
          >
            <SVG src={FigmaIcon} height={18} width={12}/>
            <AutoLayout width={'fill-parent'}>
              <Text width={'fill-parent'} href={contentNode.attrs.href}><Span>{contentNode.attrs.nodeName}{contentNode.attrs.nodeName}</Span><Span fill="#6b6f76"> - {contentNode.attrs.title}</Span></Text>
            </AutoLayout>
          </AutoLayout>
        )
      }
      else if (contentNode.type === 'blockquote') {
        const blockQuoteContent = contentNode.content.map((childNode, j) => renderParagraphData(childNode, j))
        return (
          <AutoLayout key={i} width={'fill-parent'} spacing={10}>
            <AutoLayout width={4} height={'fill-parent'} fill="#3c4149" />
            <Fragment>{blockQuoteContent}</Fragment>
          </AutoLayout>
        )
      }
      else if (contentNode.type === 'image') {
        return <Image key={i} src={contentNode.attrs.src} width={'fill-parent'} height={200}/>
      }
      else if (contentNode.type === 'video') {
        return (
          <AutoLayout
            key={i}
            width={'fill-parent'}
            height={200}
            fill="#E2E2E2"
            hoverStyle={{
              fill: "#C9C6C6"
            }}
            cornerRadius={4}
            verticalAlignItems="center"
            horizontalAlignItems="center"
            onClick={openLinearTicketURL}
          >
            <SVG src={VideoIcon} width={48} height={48} />
          </AutoLayout>
        )
      }
      else if (contentNode.type === 'code_block') {
        const content = renderParagraphData(contentNode, i)
        return <AutoLayout key={i} width={'fill-parent'} padding={18} fill="#E4E6EA">{content}</AutoLayout>
      }
      else if (contentNode.type === 'horizontal_rule') {
        return <Line key={i} stroke="#E5E5E5" strokeWidth={1} length='fill-parent' />
      }
      else if (contentNode.type === "bullet_list") {
        return renderListData(contentNode)
      }
      else if (contentNode.type === "ordered_list") {
        return renderListData(contentNode)
      }
      else if (contentNode.type === "todo_list") {
        return renderListData(contentNode)
      }
      return null
    }).filter(Boolean)
    return <AutoLayout width={'fill-parent'} direction="vertical" spacing={12}>{children}</AutoLayout>
  } catch (error) {
    console.error("Error doing 'prosemirrorToWidgetReact'", error)
    return (
      <Text
        width="fill-parent"
        verticalAlignText="top"
      >
        {linearIssue?.description}
      </Text>
    )
  }
}