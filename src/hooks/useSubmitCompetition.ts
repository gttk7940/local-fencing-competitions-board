import { collection, doc, Firestore, setDoc } from 'firebase/firestore'
import { CompetitionForm } from './useCompetitionsRegisterForm'
import { CompetitionWithoutId } from '../util/types'

type UseSubmitCompetitionArgs = {
  db: Firestore
  onSuccess: (deleteCode: string) => void
  onError: () => void
  reset: () => void
}

type UseSubmitCompetition = {
  submitCompetition: (formData: CompetitionForm) => Promise<void>
}

export const useSubmitCompetition = ({
  db,
  onSuccess,
  onError,
  reset,
}: UseSubmitCompetitionArgs): UseSubmitCompetition => {
  const submitCompetition = async (formData: CompetitionForm) => {
    const {
      startDate,
      finishDate,
      subscriptionDeadlineDate,
      ...rest
    } = formData

    if (!startDate || !finishDate || !subscriptionDeadlineDate) {
      onError()
      return
    }

    try {
      const competionWithoutId: CompetitionWithoutId = {
        ...rest,
        startDate,
        finishDate,
        subscriptionDeadlineDate,
        registrationDate: new Date(),
      }

      // 削除コードの生成
      // const deleteCode = Math.floor(Math.random() * 1000000).toString().padStart(6, '0') // 6 桁のランダムな整数を生成
      const deleteCode = '123456' // 動作確認用
      const deleteCodeObject = {
        deleteCode: deleteCode,
      }

      // ドキュメント ID の生成
      const newCompetitionDoc = doc(collection(db, 'competitions'))
      const newDocId = newCompetitionDoc.id

      // 登録
      await Promise.all([
        setDoc(doc(db, 'competitions', newDocId), competionWithoutId),
        setDoc(doc(db, 'deleteCodes', newDocId), deleteCodeObject),
      ])
      reset()
      onSuccess(deleteCode)
    } catch (error) {
      console.error(error)
      onError()
    }
  }

  return { submitCompetition }
}
