import { Box, Flex } from '@chakra-ui/react'
import {
  Firestore,
  collection,
  query,
  where,
  documentId,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { useGetCompetitions } from '../../hooks/useGetCompetitions'
import { Caution } from '../organisms/Caution'
import { CompetitionsTable } from '../organisms/CompetitionsTable/CompetitionsTable'
import { Information } from '../organisms/Information'
import { toaster, Toaster } from '../ui/toaster'

type CompetitionsViewPageArgs = {
  db: Firestore
}

export const CompetitionsViewPage = ({ db }: CompetitionsViewPageArgs) => {
  const { competitions, fetchCompetitions } = useGetCompetitions({ db })

  const createSuccessToast = () => {
    toaster.create({
      title: `削除に成功しました。`,
      type: 'success',
    })
  }

  const createWrongDeleteCodeErrorToast = () => {
    toaster.create({
      title: `削除コードが違います。`,
      type: 'error',
    })
  }

  const createDeleteErrorToast = () => {
    toaster.create({
      title: `削除に失敗しました。`,
      type: 'error',
    })
  }

  const handleDelete = async (id: string, deleteCode: string) => {
    try {
      // deleteCode が存在するか確認
      const deleteCodesRef = collection(db, 'deleteCodes')
      const getDeleteCodeQuery = query(
        deleteCodesRef,
        where(documentId(), '==', id),
        where('deleteCode', '==', deleteCode)
      )
      const deleteCodeSnap = await getDocs(getDeleteCodeQuery)
      if (deleteCodeSnap.empty) {
        createWrongDeleteCodeErrorToast()
        return
      }

      // competition を削除
      await deleteDoc(doc(db, 'competitions', id))

      // deleteCode を削除
      await deleteDoc(doc(db, 'deleteCodes', id))

      createSuccessToast()
    } catch (error) {
      console.error('handleDelete error: ', error)
      createDeleteErrorToast()
    }
    fetchCompetitions()
  }

  return (
    <Box padding="10px">
      <Flex direction="column" gap="10px">
        <Information />
        <Caution />
        <CompetitionsTable
          competitions={competitions}
          handleDelete={handleDelete}
        />
      </Flex>
      <Toaster />
    </Box>
  )
}
