import { collection, Firestore, getDocs } from 'firebase/firestore'
import { Competition } from '../util/types'
import { useEffect, useState } from 'react'

type UseGetCompetitionsArgs = {
  db: Firestore
}

type UseGetCompetitions = {
  competitions: Competition[]
  fetchCompetitions: () => Promise<void>
}

export const useGetCompetitions = ({
  db,
}: UseGetCompetitionsArgs): UseGetCompetitions => {
  const [competitions, setCompetitions] = useState<Competition[]>([])

  const fetchCompetitions = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'competitions'))
      const data = querySnapshot.docs.map((doc) => {
        const docData = doc.data()
        return {
          id: doc.id,
          name: docData.name,
          site: docData.site,
          eventCategory: docData.eventCategory,
          genderCategory: docData.genderCategory,
          ageCategory: docData.ageCategory,
          startDate: docData.startDate.toDate(),
          finishDate: docData.finishDate.toDate(),
          subscriptionDeadlineDate: docData.subscriptionDeadlineDate.toDate(),
          url: docData.url,
          notes: docData.notes,
          registrationDate: docData.registrationDate.toDate(),
        }
      })
      setCompetitions(data)
    } catch (error) {
      console.error('getCompetitions error: ', error)
    }
  }

  useEffect(() => {
    fetchCompetitions()
  }, [db])

  return { competitions, fetchCompetitions }
}
