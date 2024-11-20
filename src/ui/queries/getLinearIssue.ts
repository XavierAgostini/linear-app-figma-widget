import axios from 'axios'
import * as Y from 'yjs';
import { schema } from 'prosemirror-schema-basic';
import { Schema } from 'prosemirror-model';

import { yXmlFragmentToProseMirrorRootNode, prosemirrorJSONToYDoc } from 'y-prosemirror';

export const query = `
query ($issueId: String!) {
    issue(id: $issueId) {
    id
    identifier
    title
    description
    descriptionState
    priority
    priorityLabel
    estimate
    team {
      issueEstimationAllowZero
      issueEstimationExtended
      defaultIssueEstimate
      issueEstimationType
    }
    attachments {
      nodes {
          id
          url
      }
    }
    labels {
        nodes {
            name
            color
        }
    }
    state {
        id
        name
        color
        type
        position
    }
    url
    assignee {
        name
        displayName
        id
        avatarUrl
    }
    }
}`


export const extendedSchema = new Schema({
  nodes: {
    doc: { content: 'block+' },
    paragraph: { content: 'inline*', group: 'block', parseDOM: [{ tag: 'p' }], toDOM: () => ['p', 0] },
    text: { group: 'inline' },
    heading: {
      attrs: { id: { default: null }, level: { default: 1 } },
      content: 'inline*',
      group: 'block',
      defining: true,
      parseDOM: [
        {
          tag: 'heading',
          getAttrs: (dom: HTMLElement) => ({
            id: dom.getAttribute('id'),
            level: parseInt(dom.getAttribute('level') || '1', 10),
          }),
        },
      ],
      toDOM: (node) => ['heading', { id: node.attrs.id, level: node.attrs.level }, 0],
    },
    bullet_list: {
      content: 'list_item+',
      group: 'block',
      parseDOM: [{ tag: 'ul' }],
      toDOM: () => ['ul', 0],
    },
    ordered_list: {
      attrs: { order: { default: 1 } },
      content: 'list_item+',
      group: 'block',
      parseDOM: [
        {
          tag: 'ol',
          getAttrs: (dom: HTMLElement) => ({
            order: parseInt(dom.getAttribute('order') || '1', 10),
          }),
        },
      ],
      toDOM: (node) => ['ol', { order: node.attrs.order }, 0],
    },
    list_item: {
      content: 'paragraph block*',
      parseDOM: [{ tag: 'li' }],
      toDOM: () => ['li', 0],
    },
    todo_list: {
      content: 'todo_item+',
      group: 'block',
      parseDOM: [{ tag: 'todo_list' }],
      toDOM: () => ['todo_list', 0],
    },
    todo_item: {
      attrs: { done: { default: false } },
      content: 'paragraph',
      parseDOM: [
        {
          tag: 'todo_item',
          getAttrs: (dom: HTMLElement) => ({
            done: dom.getAttribute('done') === 'true',
          }),
        },
      ],
      toDOM: (node) => ['todo_item', { done: node.attrs.done }, 0],
    },
    horizontal_rule: {
      group: 'block',
      parseDOM: [{ tag: 'hr' }],
      toDOM: () => ['hr'],
    },
    blockquote: {
      content: 'block+',
      group: 'block',
      parseDOM: [{ tag: 'blockquote' }],
      toDOM: () => ['blockquote', 0],
    },
    image: {
      attrs: {
        alt: { default: null },
        attribution: { default: null },
        displayWidth: { default: null },
        height: { default: null },
        originalSrc: { default: null },
        src: { default: null },
        title: { default: null },
        width: { default: null },
      },
      group: 'block',
      parseDOM: [
        {
          tag: 'image',
          getAttrs: (dom: HTMLElement) => ({
            alt: dom.getAttribute('alt'),
            attribution: dom.getAttribute('attribution'),
            displayWidth: dom.getAttribute('displayWidth'),
            height: dom.getAttribute('height'),
            originalSrc: dom.getAttribute('originalSrc'),
            src: dom.getAttribute('src'),
            title: dom.getAttribute('title'),
            width: dom.getAttribute('width'),
          }),
        },
      ],
      toDOM: (node) => [
        'img',
        {
          alt: node.attrs.alt,
          attribution: node.attrs.attribution,
          displayWidth: node.attrs.displayWidth,
          height: node.attrs.height,
          originalSrc: node.attrs.originalSrc,
          src: node.attrs.src,
          title: node.attrs.title,
          width: node.attrs.width,
        },
      ],
    },
  },
  marks: {
    strong: {
      parseDOM: [{ tag: 'strong' }],
      toDOM: () => ['strong', 0],
    },
    em: {
      parseDOM: [{ tag: 'em' }],
      toDOM: () => ['em', 0],
    },
    underline: {
      parseDOM: [{ tag: 'u' }],
      toDOM: () => ['u', 0],
    },
  },
});
function decodeYjsStringToProseMirror(yjsString: string, fragmentKey = 'prosemirror') {
  try {
      // Decode the Yjs string into binary data
      const binaryData = Uint8Array.from(atob(yjsString), (char) => char.charCodeAt(0));
      
      // Create a new Y.Doc and apply the update
      const ydoc = new Y.Doc();
      Y.applyUpdate(ydoc, binaryData);

      // Get the fragment for ProseMirror from Y.Doc
      const fragment = ydoc.getXmlFragment(fragmentKey);
      if (!fragment) {
          console.warn(`Fragment key "${fragmentKey}" not found in the Y.Doc.`);
          return null;
      }
      // Convert the Yjs fragment to ProseMirror JSON
      const prosemirrorJson = yXmlFragmentToProseMirrorRootNode(fragment,extendedSchema);
      return JSON.stringify(prosemirrorJson);
  } catch (error) {
      console.error('Error decoding Yjs string:', error);
      throw error;
  }
}
export const getLinearIssue = async (issueId: string, token: string) => {
  try {
    const { data } = await axios.post(
      'https://api.linear.app/graphql',
      {
        query,
        variables: {
          issueId: issueId
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      }
    )
    const { data: linearData, errors } = data;
    if (errors) {
      let errorMsg = errors[0]?.extensions?.userPresentableMessage
      throw new Error(errorMsg)
    }
    const { issue } = linearData
    // Decode the descriptionState to ProseMirror JSON
    const updatedDescriptionState = decodeYjsStringToProseMirror(issue?.descriptionState)
    issue.descriptionState = updatedDescriptionState
    return issue;
  } catch (error: any) {
    console.error("Error doing 'getLinearIssue", error)
    const status = error?.response?.status
    const errorCode = error?.response?.data?.errors[0]?.extensions?.code
    if (status === 400 && errorCode === 'AUTHENTICATION_ERROR') {
      throw new Error("AUTHENTICATION_ERROR")
    }
    throw error;
  }
}