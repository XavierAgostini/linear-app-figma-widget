import React from 'react'

export const LinearBacklogIcon = ({ color } : {color: string}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-label="Backlog" fill={color}>
    <path d="M13.9408 7.91426L11.9576 7.65557C11.9855 7.4419 12 7.22314 12 7C12 6.77686 11.9855 6.5581 11.9576 6.34443L13.9408 6.08573C13.9799 6.38496 14 6.69013 14 7C14 7.30987 13.9799 7.61504 13.9408 7.91426ZM13.4688 4.32049C13.2328 3.7514 12.9239 3.22019 12.5538 2.73851L10.968 3.95716C11.2328 4.30185 11.4533 4.68119 11.6214 5.08659L13.4688 4.32049ZM11.2615 1.4462L10.0428 3.03204C9.69815 2.76716 9.31881 2.54673 8.91341 2.37862L9.67951 0.531163C10.2486 0.767153 10.7798 1.07605 11.2615 1.4462ZM7.91426 0.0591659L7.65557 2.04237C7.4419 2.01449 7.22314 2 7 2C6.77686 2 6.5581 2.01449 6.34443 2.04237L6.08574 0.059166C6.38496 0.0201343 6.69013 0 7 0C7.30987 0 7.61504 0.0201343 7.91426 0.0591659ZM4.32049 0.531164L5.08659 2.37862C4.68119 2.54673 4.30185 2.76716 3.95716 3.03204L2.73851 1.4462C3.22019 1.07605 3.7514 0.767153 4.32049 0.531164ZM1.4462 2.73851L3.03204 3.95716C2.76716 4.30185 2.54673 4.68119 2.37862 5.08659L0.531164 4.32049C0.767153 3.7514 1.07605 3.22019 1.4462 2.73851ZM0.0591659 6.08574C0.0201343 6.38496 0 6.69013 0 7C0 7.30987 0.0201343 7.61504 0.059166 7.91426L2.04237 7.65557C2.01449 7.4419 2 7.22314 2 7C2 6.77686 2.01449 6.5581 2.04237 6.34443L0.0591659 6.08574ZM0.531164 9.67951L2.37862 8.91341C2.54673 9.31881 2.76716 9.69815 3.03204 10.0428L1.4462 11.2615C1.07605 10.7798 0.767153 10.2486 0.531164 9.67951ZM2.73851 12.5538L3.95716 10.968C4.30185 11.2328 4.68119 11.4533 5.08659 11.6214L4.32049 13.4688C3.7514 13.2328 3.22019 12.9239 2.73851 12.5538ZM6.08574 13.9408L6.34443 11.9576C6.5581 11.9855 6.77686 12 7 12C7.22314 12 7.4419 11.9855 7.65557 11.9576L7.91427 13.9408C7.61504 13.9799 7.30987 14 7 14C6.69013 14 6.38496 13.9799 6.08574 13.9408ZM9.67951 13.4688L8.91341 11.6214C9.31881 11.4533 9.69815 11.2328 10.0428 10.968L11.2615 12.5538C10.7798 12.9239 10.2486 13.2328 9.67951 13.4688ZM12.5538 11.2615L10.968 10.0428C11.2328 9.69815 11.4533 9.31881 11.6214 8.91341L13.4688 9.67951C13.2328 10.2486 12.924 10.7798 12.5538 11.2615Z" stroke="none"></path>
  </svg>
)

export const LinearTodoIcon = ({ color } : {color: string}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="Todo" ><rect x="1" y="1" width="12" height="12" rx="6" stroke={color} stroke-width="2" fill="none"></rect><path fill={color} stroke="none" d="M 3.5,3.5 L3.5,0 A3.5,3.5 0 0,1 3.5, 0 z" transform="translate(3.5,3.5)"></path></svg>
)
export const LinearInProgressIcon = ({ color } : {color: string}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-label="In Progress" ><rect x="1" y="1" width="12" height="12" rx="6" stroke={color} stroke-width="2" fill="none"></rect><path fill={color} stroke="none" d="M 3.5,3.5 L3.5,0 A3.5,3.5 0 0,1 3.5, 7 z" transform="translate(3.5,3.5)"></path></svg>
)

export const LinearDoneIcon = ({ color } : {color: string}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-label="Done" fill={color} >
    <path fillRule="evenodd" clipRule="evenodd" d="M7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0ZM11.101 5.10104C11.433 4.76909 11.433 4.23091 11.101 3.89896C10.7691 3.56701 10.2309 3.56701 9.89896 3.89896L5.5 8.29792L4.10104 6.89896C3.7691 6.56701 3.2309 6.56701 2.89896 6.89896C2.56701 7.2309 2.56701 7.7691 2.89896 8.10104L4.89896 10.101C5.2309 10.433 5.7691 10.433 6.10104 10.101L11.101 5.10104Z"></path>
  </svg>
)
export const LinearCancelledIcon = ({ color } : {color: string}) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-label="Canceled" fill={color} >
    <path fillRule="evenodd" clipRule="evenodd" d="M7 14C10.866 14 14 10.866 14 7C14 3.13401 10.866 0 7 0C3.13401 0 0 3.13401 0 7C0 10.866 3.13401 14 7 14ZM5.03033 3.96967C4.73744 3.67678 4.26256 3.67678 3.96967 3.96967C3.67678 4.26256 3.67678 4.73744 3.96967 5.03033L5.93934 7L3.96967 8.96967C3.67678 9.26256 3.67678 9.73744 3.96967 10.0303C4.26256 10.3232 4.73744 10.3232 5.03033 10.0303L7 8.06066L8.96967 10.0303C9.26256 10.3232 9.73744 10.3232 10.0303 10.0303C10.3232 9.73744 10.3232 9.26256 10.0303 8.96967L8.06066 7L10.0303 5.03033C10.3232 4.73744 10.3232 4.26256 10.0303 3.96967C9.73744 3.67678 9.26256 3.67678 8.96967 3.96967L7 5.93934L5.03033 3.96967Z" stroke="none"></path>
  </svg>
)

export const LinearHighPriorityIcon = (
<svg fill="#00000070" width="16" height="16" viewBox="0 0 16 16" aria-label="High Priority"><rect x="1" y="8" width="3" height="6" rx="1"></rect><rect x="6" y="5" width="3" height="9" rx="1"></rect><rect x="11" y="2" width="3" height="12" rx="1"></rect></svg>
)
export const LinearMediumPriorityIcon = (
  <svg fill="#00000070" width="16" height="16" viewBox="0 0 16 16" aria-label="Medium Priority"><rect x="1" y="8" width="3" height="6" rx="1"></rect><rect x="6" y="5" width="3" height="9" rx="1"></rect><rect x="11" y="2" width="3" height="12" rx="1" fill-opacity="0.4"></rect></svg>
)

export const LinearLowPriorityIcon = (
  <svg fill="#00000070" width="16" height="16" viewBox="0 0 16 16" aria-label="Low Priority"><rect x="1" y="8" width="3" height="6" rx="1"></rect><rect x="6" y="5" width="3" height="9" rx="1" fill-opacity="0.4"></rect><rect x="11" y="2" width="3" height="12" rx="1" fill-opacity="0.4"></rect></svg>
)

export const LinearUrgentPriorityIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#F2994A" aria-label="Urgent Priority"><path d="M3 1.346a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-10a2 2 0 0 0-2-2H3Zm3.914 3h1.738L8.5 9.948H7.07l-.156-5.602Zm1.809 7.164a.95.95 0 0 1-.938.938.934.934 0 1 1 0-1.867c.5 0 .934.417.938.929Z"></path></svg>
)

export const LinearNoPriorityIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-label="No Priority" fill="#00000070"><path d="M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM9 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0ZM13 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0Z"></path></svg>
)

export const LinearUnassignedIcon = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="#6B6F76"><path d="M8 4a2 2 0 0 0-2 2v.5a2 2 0 0 0 4 0V6a2 2 0 0 0-2-2Z"></path><path fillRule="evenodd" clipRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm-2.879-4.121-1.01 1.01a5.5 5.5 0 1 1 7.778 0l-1.01-1.01A3 3 0 0 0 8.757 10H7.243a3 3 0 0 0-2.122.879Z"></path></svg>
)