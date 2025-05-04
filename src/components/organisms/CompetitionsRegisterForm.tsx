import {
  Box,
  Button,
  Checkbox,
  CheckboxGroup,
  Field,
  Fieldset,
  Input,
  Stack,
  Textarea,
} from '@chakra-ui/react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { Controller } from 'react-hook-form'
import { collection, doc, Firestore, setDoc } from 'firebase/firestore'
import {
  ageCategories,
  CompetitionRegisterForm,
  CompetitionWithoutId,
  eventCategories,
  genderCategories,
} from '../../util/types'
import { useCompetitionsRegisterForm } from '../../hooks/useCompetitionsRegisterForm'
import { Toaster, toaster } from '../ui/toaster'

type CompetitionsRegisterFormArgs = {
  db: Firestore
}

const toLabelValueItems = <T extends readonly string[]>(items: T) => {
  return items.map((item) => ({ label: item, value: item }))
}

const eventCategoryItems = toLabelValueItems(eventCategories)
const genderCategoryItems = toLabelValueItems(genderCategories)
const ageCategoryItems = toLabelValueItems(ageCategories)

export const CompetitionsRegisterForm = ({
  db,
}: CompetitionsRegisterFormArgs) => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    formState,
    eventCategory,
    genderCategory,
    ageCategory,
  } = useCompetitionsRegisterForm()

  const createSuccessToast = (deleteCode: string) => {
    toaster.create({
      title: (
        <>
          大会の登録に成功しました。
          <br />
          登録した大会の削除コードは「{deleteCode}」です。大切にお控えください。
          <br />
          このトーストは 5 分後に自動的に閉じます。
        </>
      ),
      type: 'success',
      duration: 1000 * 60 * 1,
    })
  }

  const createErrorToast = () => {
    toaster.create({
      title: `大会の登録に失敗しました。`,
      type: 'error',
    })
  }

  const onSubmit = async (formData: CompetitionRegisterForm) => {
    try {
      const competionWithoutId: CompetitionWithoutId = {
        ...formData,
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
      createSuccessToast(deleteCode)
    } catch (error) {
      console.error(error)
      createErrorToast()
    }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="30px">
          <Field.Root invalid={!!formState.errors.name}>
            <Field.Label>大会名 (必須)</Field.Label>
            <Input
              {...register('name')}
              placeholder="100 文字まで入力できます"
            />
            <Field.ErrorText>{formState.errors.name?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!formState.errors.site}>
            <Field.Label>会場 (必須)</Field.Label>
            <Input
              {...register('site')}
              placeholder="100 文字まで入力できます"
            />
            <Field.ErrorText>{formState.errors.site?.message}</Field.ErrorText>
          </Field.Root>

          <Fieldset.Root invalid={!!formState.errors.eventCategory}>
            <Fieldset.Legend>
              種目 (必須、該当する項目をすべて選択)
            </Fieldset.Legend>
            <CheckboxGroup
              invalid={!!formState.errors.eventCategory}
              value={eventCategory.field.value}
              onValueChange={(values) => {
                // 表示順に並び替えてからセット
                const sorted = eventCategories.filter((item) =>
                  values.includes(item)
                )
                eventCategory.field.onChange(sorted)
              }}
            >
              <Fieldset.Content>
                {eventCategoryItems.map((item) => (
                  <Checkbox.Root key={item.value} value={item.value}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>{item.label}</Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </Fieldset.Content>
            </CheckboxGroup>
            <Fieldset.ErrorText>
              {formState.errors.eventCategory?.message}
            </Fieldset.ErrorText>
          </Fieldset.Root>

          <Fieldset.Root invalid={!!formState.errors.genderCategory}>
            <Fieldset.Legend>
              性別 (必須、該当する項目をすべて選択)
            </Fieldset.Legend>
            <CheckboxGroup
              invalid={!!formState.errors.genderCategory}
              value={genderCategory.field.value}
              onValueChange={(values) => {
                // 表示順に並び替えてからセット
                const sorted = genderCategories.filter((item) =>
                  values.includes(item)
                )
                genderCategory.field.onChange(sorted)
              }}
            >
              <Fieldset.Content>
                {genderCategoryItems.map((item) => (
                  <Checkbox.Root key={item.value} value={item.value}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>{item.label}</Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </Fieldset.Content>
            </CheckboxGroup>
            <Fieldset.ErrorText>
              {formState.errors.genderCategory?.message}
            </Fieldset.ErrorText>
          </Fieldset.Root>

          <Fieldset.Root invalid={!!formState.errors.ageCategory}>
            <Fieldset.Legend>
              年齢区分 (必須、該当する項目をすべて選択)
            </Fieldset.Legend>
            <CheckboxGroup
              invalid={!!formState.errors.ageCategory}
              value={ageCategory.field.value}
              onValueChange={(values) => {
                // 表示順に並び替えてからセット
                const sorted = ageCategories.filter((item) =>
                  values.includes(item)
                )
                ageCategory.field.onChange(sorted)
              }}
            >
              <Fieldset.Content>
                {ageCategoryItems.map((item) => (
                  <Checkbox.Root key={item.value} value={item.value}>
                    <Checkbox.HiddenInput />
                    <Checkbox.Control />
                    <Checkbox.Label>{item.label}</Checkbox.Label>
                  </Checkbox.Root>
                ))}
              </Fieldset.Content>
            </CheckboxGroup>
            <Fieldset.ErrorText>
              {formState.errors.ageCategory?.message}
            </Fieldset.ErrorText>
          </Fieldset.Root>

          <Field.Root invalid={!!formState.errors.startDate}>
            <Field.Label>大会開始日 (変更必須)</Field.Label>
            <Controller
              name="startDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="日付を選択"
                  popperPlacement="bottom-end"
                />
              )}
            />
            <Field.ErrorText>
              {formState.errors.startDate?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!formState.errors.finishDate}>
            <Field.Label>大会終了日 (変更必須)</Field.Label>
            <Controller
              name="finishDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="日付を選択"
                  popperPlacement="bottom-end"
                />
              )}
            />
            <Field.ErrorText>
              {formState.errors.finishDate?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!formState.errors.subscriptionDeadlineDate}>
            <Field.Label>申込締切日 (変更必須)</Field.Label>
            <Controller
              name="subscriptionDeadlineDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={field.onChange}
                  dateFormat="yyyy/MM/dd"
                  placeholderText="日付を選択"
                  popperPlacement="bottom-end"
                />
              )}
            />
            <Field.ErrorText>
              {formState.errors.subscriptionDeadlineDate?.message}
            </Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!formState.errors.url}>
            <Field.Label>大会ページ URL (任意)</Field.Label>
            <Input
              {...register('url')}
              placeholder="300 文字まで入力できます"
            />
            <Field.ErrorText>{formState.errors.url?.message}</Field.ErrorText>
          </Field.Root>
          <Field.Root invalid={!!formState.errors.notes}>
            <Field.Label>備考 (任意)</Field.Label>
            <Textarea
              {...register('notes')}
              placeholder="300 文字まで入力できます"
            />
            <Field.ErrorText>{formState.errors.notes?.message}</Field.ErrorText>
          </Field.Root>
          <Button
            size="sm"
            type="submit"
            disabled={!formState.isValid}
            loading={formState.isSubmitting}
          >
            登録
          </Button>
        </Stack>
      </form>
      <Toaster />
    </Box>
  )
}
