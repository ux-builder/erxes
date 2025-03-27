import { gql } from "@apollo/client"

const call = gql`
  mutation cloudflareMakeCall(
    $callerNumber: String!
    $roomState: String!
    $audioTrack: String!
    $integrationId: String!
    $departmentId: String!
  ) {
    cloudflareMakeCall(
      callerNumber: $callerNumber
      roomState: $roomState
      audioTrack: $audioTrack
      integrationId: $integrationId
      departmentId: $departmentId
    )
  }
`
const leaveCall = gql`
  mutation CloudflareLeaveCall(
    $roomState: String!
    $originator: String
    $duration: Int
    $audioTrack: String!
  ) {
    cloudflareLeaveCall(
      roomState: $roomState
      originator: $originator
      duration: $duration
      audioTrack: $audioTrack
    )
  }
`
export default {
  call,
  leaveCall,
}
