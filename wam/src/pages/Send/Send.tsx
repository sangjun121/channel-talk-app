import { useEffect, useMemo, useCallback, useState } from 'react'
import {
  VStack,
  HStack,
  Button,
  Text,
  Icon,
  // ButtonGroup,
  // Checkbox,
  TextField,
} from '@channel.io/bezier-react'
import { CancelIcon, SendIcon } from '@channel.io/bezier-icons'

import {
  callFunction,
  // callNativeFunction,
  close,
  getWamData,
  setSize,
} from '../../utils/wam'
import * as Styled from './Send.styled'
import CompleteNotify from './CompleteNotify'

function Send() {
  useEffect(() => { //화면사이즈 설정
    setSize(390, 172) 
  }, [])

  const [courseName, setCourseName] = useState<string>('');
  const [courseNumber, setCourseNumber] = useState<string>('');
  const [classNumber, setClassNumber] = useState<string>('');

  const handleCourseNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourseName(event.target.value);
    console.log(event.target.value);
  };

  const handleCourseNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCourseNumber(event.target.value);
  };

  const handleClassNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setClassNumber(event.target.value);
  };

  const chatTitle = useMemo(() => getWamData('chatTitle') ?? '', [])

  const appId = useMemo(() => getWamData('appId') ?? '', [])
  const channelId = useMemo(() => getWamData('channelId') ?? '', [])
  const managerId = useMemo(() => getWamData('managerId') ?? '', [])
  const message = useMemo(() => getWamData('message') ?? '', [])
  const chatId = useMemo(() => getWamData('chatId') ?? '', [])
  const chatType = useMemo(() => getWamData('chatType') ?? '', [])
  const broadcast = useMemo(() => Boolean(getWamData('broadcast') ?? false), [])
  const rootMessageId = useMemo(() => getWamData('rootMessageId'), [])

  const handleSave = useCallback(
      async (): Promise<void> => {
        console.log(courseName, courseNumber, classNumber);
        
        await callFunction(appId, 'saveLecture', {
          input: {
            groupId: chatId,
            broadcast,
            rootMessageId,
            courseName: courseName,
            courseNumber: courseNumber,
            classNumber: classNumber
          }
        })
      },
      [
        appId,
        broadcast,
        channelId,
        chatId,
        chatType,
        managerId,
        message,
        rootMessageId,
        courseName,
        courseNumber,
        classNumber
      ]
    )
  // const handleSend = useCallback(
  //   async (sender: string): Promise<void> => {
  //     if (chatType === 'group') {
  //       switch (sender) {
  //         case 'bot':
  //           await callFunction(appId, 'sendAsBot', {
  //             input: {
  //               groupId: chatId,
  //               broadcast,
  //               rootMessageId,
  //             },
  //           })
  //           break
  //         case 'manager':
  //           await callNativeFunction('writeGroupMessageAsManager', {
  //             channelId,
  //             groupId: chatId,
  //             rootMessageId,
  //             broadcast,
  //             dto: {
  //               plainText: message,
  //               managerId,
  //             },
  //           })
  //           break
  //         default:
  //           // NOTE: should not reach here
  //           console.error('Invalid message sender')
  //       }
  //     } else if (chatType === 'directChat') {
  //       // FIXME: Implement
  //     } else if (chatType === 'userChat') {
  //       // FIXME: Implement
  //     }
  //   },
  //   [
  //     appId,
  //     broadcast,
  //     channelId,
  //     chatId,
  //     chatType,
  //     managerId,
  //     message,
  //     rootMessageId,
  //   ]
  // )

  return (
    <VStack spacing={16}>
      <HStack justify="between">
        <Text
          color="txt-black-darkest"
          typo="24"
          bold
        >
          강의를 등록하세요!
        </Text>
        <Button
          colorVariant="monochrome-dark"
          styleVariant="tertiary"
          leftContent={CancelIcon}
          onClick={() => close()}
        />
      </HStack>
      <HStack justify="center">
        <TextField
          placeholder="강의명"
          value={courseName}
          onChange={handleCourseNameChange}
        />
        <TextField
          placeholder="학수번호"
          value={courseNumber}
          onChange={handleCourseNumberChange}
        />
        <TextField
          placeholder="반 번호"
          value={classNumber}
          onChange={handleClassNumberChange}
        />
      </HStack>
      <HStack justify="center">
          <Button
            colorVariant="blue"
            styleVariant="primary"
            text="저장하기"
            onClick={async () => {
              await handleSave()
              CompleteNotify()
              close()
            }}
          />
      </HStack>
      <HStack justify="center">
        <Styled.CenterTextWrapper>
          <Icon
            source={SendIcon}
            color="txt-black-dark"
            size="xs"
          />
          <Text
            as="span"
            color="txt-black-dark"
          >
            {chatTitle}
          </Text>
        </Styled.CenterTextWrapper>
      </HStack>
    </VStack>
  )
}

export default Send
