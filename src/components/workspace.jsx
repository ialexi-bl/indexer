import React from 'react'
import {
  Button,
  ButtonsRow,
  DeadBtn,
  Form,
  FormTitle,
  InputRow,
  UnsureBtn,
} from './form'
import classNames from 'classnames'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import Select from 'react-select'
import TableController from 'services/TableController'
import KeyBinding, { useAltGr } from '../services/KeyBinding'
import { Slide, toast } from 'react-toastify'
import 'styles/workspace.scss'

toast.configure()

const disabledFields = [
  'husband.maiden_name',
  'husband.other',
  'wife.maiden_name',
  'wife.other',
]
const checkLabels = {
  first_name: 'imię',
  last_name: 'nazwisko',
  maiden_name: 'alias',
  age: 'wiek',
  father: 'imię ojca',
  mother: 'imię matki',
}

function createFieldsDesc(t) {
  return (order) => {
    const linkHusband = (field) => {
      const index = order.husband.indexOf(field)
      return {
        prev:
          index - 1 in order.husband
            ? `husband.${order.husband[index - 1]}`
            : 'document',
        next:
          index + 1 in order.husband
            ? `husband.${order.husband[index + 1]}`
            : `wife.${order.wife[0]}`,
      }
    }
    const linkWife = (field) => {
      const index = order.wife.indexOf(field)
      return {
        prev:
          index - 1 in order.wife
            ? `wife.${order.wife[index - 1]}`
            : `husband.${order.husband[order.husband.length - 1]}`,
        next:
          index + 1 in order.wife
            ? `wife.${order.husband[index + 1]}`
            : 'button',
      }
    }

    const wifeMaidenNameChoice = [
      { label: t('Maiden name'), value: '' },
      { label: t('Alias', { context: 'female' }), value: 'alias' },
      { label: t('Primo voto'), value: 'primo voto' },
    ]

    return Object.fromEntries(
      Object.entries({
        year: {
          prev: null,
          next: 'document',
        },
        document: {
          prev: 'year',
          next: `husband.${order.husband[0]}`,
        },
        'husband.first_name': {
          ...linkHusband('first_name'),
          label: t('First name'),
          value: '',
        },
        'husband.last_name': {
          ...linkHusband('last_name'),
          label: t('Last name'),
          value: '',
        },
        'husband.maiden_name': {
          ...linkHusband('maiden_name'),
          label: t('Alias', { context: 'male' }),
          type: 'alias',
          value: '',
          disabled: true,
        },
        'husband.age': {
          ...linkHusband('age'),
          label: t('Age'),
          value: '',
        },
        'husband.father': {
          ...linkHusband('father'),
          label: t('Father'),
          value: '',
          canBeDead: true,
        },
        'husband.mother': {
          ...linkHusband('mother'),
          label: t('Mother'),
          value: '',
          canBeDead: true,
        },
        'husband.other': {
          ...linkHusband('other'),
          label: t('Other'),
          value: '',
          disabled: true,
          forbidUnsure: true,
        },
        'wife.first_name': {
          ...linkWife('first_name'),
          label: t('First name'),
          value: '',
        },
        'wife.last_name': {
          ...linkWife('last_name'),
          label: t('Last name'),
          value: '',
        },
        'wife.maiden_name': {
          ...linkWife('maiden_name'),
          value: '',
          disabled: true,
          type: wifeMaidenNameChoice[0],
          typeChoice: wifeMaidenNameChoice,
        },
        'wife.age': {
          ...linkWife('age'),
          label: t('Age'),
          value: '',
        },
        'wife.father': {
          ...linkWife('father'),
          label: t('Father'),
          value: '',
          canBeDead: true,
        },
        'wife.mother': {
          ...linkWife('mother'),
          label: t('Mother'),
          value: '',
          canBeDead: true,
        },
        'wife.other': {
          ...linkWife('other'),
          label: t('Other'),
          value: '',
          disabled: true,
          forbidUnsure: true,
        },
        button: {
          prev: `wife.${order.wife[order.wife.length - 1]}`,
          next: null,
        },
      }).map(([field, desc]) => [
        field,
        {
          ...desc,
          name: field,
        },
      ])
    )
  }
}

const CHANGE_CONFIG = 'CHANGE_CONFIG'
const SET_UNSURE = 'SET_UNSURE'
const SET_VALUE = 'SET_VALUE'
const SET_DEAD = 'SET_DEAD'
const SET_TYPE = 'SET_TYPE'
const ENABLE = 'ENABLE'
const RESET = 'RESET'

function fieldsReducer(state, action) {
  switch (action.type) {
    case SET_VALUE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
        },
      }
    case SET_TYPE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          type: action.option,
        },
      }
    case SET_DEAD:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          dead: action.dead,
        },
      }
    case SET_UNSURE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          unsure: action.state,
        },
      }
    case ENABLE:
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          disabled: false,
        },
      }
    case RESET:
      return Object.fromEntries(
        Object.entries(state).map(([field, desc]) => [
          field,
          {
            ...desc,
            disabled: disabledFields.includes(field),
            value: '',
            dead: false,
            unsure: false,
          },
        ])
      )
    case CHANGE_CONFIG:
      const newConfig = createFieldsDesc(action.t)(action.order)
      return Object.fromEntries(
        Object.entries(state).map(([field, desc]) => [
          field,
          {
            ...newConfig[field],
            value: desc.value,
            dead: desc.dead,
            disabled: desc.disabled,
          },
        ])
      )
  }
}

const changeConfig = (t, order) => ({ type: CHANGE_CONFIG, t, order })
const setUnsure = (field, state) => ({ type: SET_UNSURE, field, state })
const setValue = (field, value) => ({ type: SET_VALUE, field, value })
const setType = (field, type) => ({ type: SET_TYPE, field, option: type })
const setDead = (field, dead) => ({ type: SET_DEAD, field, dead })
const enable = (field) => ({ type: ENABLE, field })
const reset = () => ({ type: RESET })

const choiceStyles = {
  container: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  control: (provided) => ({
    ...provided,
    minHeight: '1px',
    height: '28px',
  }),
  input: (provided) => ({
    ...provided,
    marginTop: -2,
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    minHeight: '1px',
    padding: '0 4px',
  }),
  indicatorSeparator: (provided) => ({
    ...provided,
    minHeight: '1px',
    height: '10px',
  }),
  clearIndicator: (provided) => ({
    ...provided,
    minHeight: '1px',
  }),
  valueContainer: (provided) => ({
    ...provided,
    minHeight: '1px',
    height: '28px',
    paddingTop: '0',
    paddingBottom: '0',
  }),
  singleValue: (provided) => ({
    ...provided,
    minHeight: '1px',
    paddingBottom: '2px',
  }),
}

function Workspace({ className, inputsOrder, enablePolishLetters }) {
  const { t, i18n } = useTranslation(),
    [fields, fieldsDispatch] = React.useReducer(
      fieldsReducer,
      inputsOrder,
      createFieldsDesc(t)
    ),
    { current: inputRefs } = React.useRef({}),
    // Year & document
    [currentYear, setCurrentYear] = React.useState(
      React.useMemo(() => localStorage.getItem('lastYear') || '', [])
    ),
    [currentDocument, setCurrentDocument] = React.useState(
      React.useMemo(() => localStorage.getItem('lastDocument') || '', [])
    ),
    onYearChanged = React.useCallback(
      (e) => localStorage.setItem('lastYear', e.target.value),
      []
    ),
    onDocumentChanged = React.useCallback(
      (e) => localStorage.setItem('lastDocument', e.target.value),
      []
    ),
    mapFieldsToInputs = React.useCallback(
      (prefix, order) => {
        return order.map((field) => {
          field = `${prefix}.${field}`
          const desc = fields[field]
          return (
            <React.Fragment key={field}>
              {!desc.forbidUnsure && (
                <UnsureBtn
                  checked={desc.unsure}
                  onChange={(state) => fieldsDispatch(setUnsure(field, state))}
                />
              )}
              <InputRow
                erasable
                value={desc.value}
                disabled={desc.disabled}
                inputRef={(elem) => (inputRefs[field] = elem)}
                onChange={(e) =>
                  fieldsDispatch(setValue(field, e.target.value))
                }
                onClick={
                  desc.disabled ? () => fieldsDispatch(enable(field)) : void 0
                }
                name={field}
                label={
                  desc.typeChoice ? (
                    <Select
                      options={desc.typeChoice}
                      value={desc.type}
                      onChange={(option) =>
                        fieldsDispatch(setType(field, option))
                      }
                      styles={choiceStyles}
                    />
                  ) : (
                    desc.label
                  )
                }
              />
              {desc.canBeDead && (
                <DeadBtn
                  checked={desc.dead}
                  onChange={(state) => fieldsDispatch(setDead(field, state))}
                />
              )}
            </React.Fragment>
          )
        })
      },
      [fields, inputRefs]
    ),
    saveRow = React.useCallback(() => {
      if (!Object.values(fields).some((x) => x.value && x.value.trim())) {
        toast.dismiss('emptyNotification')
        return toast.error(t('Enter the data first!'), {
          position: toast.POSITION.TOP_CENTER,
          className: 'App__Toast',
          autoClose: 1500,
          hideProgressBar: true,
          toastId: 'emptyNotification',
          transition: Slide,
        })
      }
      const rows = {
        husband: { year: currentYear, document: currentDocument, check: '' },
        wife: { year: currentYear, document: currentDocument, check: '' },
      }

      for (let name of Object.keys(fields)) {
        const [set, key] = name.split('.')
        const field = fields[name]
        if (!key) continue
        rows[set][key] = field.value
          ? (field.type && field.type.value ? field.type.value + ' ' : '') + // Prefixes (primo voto, alias)
            field.value +
            (field.dead ? ' +' : '') // Postfixes (dead)
          : ''
        if (field.unsure) rows[set].check += `${checkLabels[key]}, `
      }
      rows.husband.check = rows.husband.check.replace(/, $/, '')
      rows.wife.check = rows.wife.check.replace(/, $/, '')

      TableController.addRow(rows.husband)
      TableController.addRow(rows.wife)
      setCurrentDocument(+currentDocument + 1)
      fieldsDispatch(reset())
    }, [currentYear, fields, currentDocument]),
    // Movement between fields
    onContKeyDown = React.useCallback(
      (e) => {
        const name = e.target.attributes.name
        if (!name) return

        if (
          KeyBinding.get('markDead').test(e) &&
          fields[name.value].canBeDead
        ) {
          return fieldsDispatch(setDead(name.value, !fields[name.value].dead))
        }
        if (KeyBinding.get('eraseField').test(e)) {
          return fieldsDispatch(setValue(name.value, ''))
        }
        if (KeyBinding.get('setUnsure').test(e)) {
          return fieldsDispatch(
            setUnsure(name.value, !fields[name.value].unsure)
          )
        }

        const direction = KeyBinding.get('navigateForwards').test(e)
          ? 'next'
          : KeyBinding.get('navigateBackwards').test(e)
          ? 'prev'
          : null

        if (!direction) return
        e.preventDefault()
        let nextField = fields[name.value][direction]

        const forceEnable = KeyBinding.getControl('forceEnable').test(e)
        // Switching to next field while it is disabled (if not forced) and unless it is not defined (for first and last ones)
        while (
          fields[nextField] &&
          fields[nextField].disabled &&
          !forceEnable &&
          fields[nextField][direction] !== null
        )
          nextField = fields[nextField][direction]

        if (nextField) {
          if (fields[nextField] && fields[nextField].disabled)
            fieldsDispatch(enable(nextField))
          inputRefs[nextField].focus()
        }
        // If navigated forwards while focused on the button
        else if (direction === 'next') {
          saveRow()
          inputRefs[`husband.${inputsOrder.husband[0]}`].focus()
        }
        // Otherwise navigated backwards staying on year
      },
      [inputRefs, saveRow, fields, inputsOrder.husband]
    )

  React.useEffect(() => {
    fieldsDispatch(changeConfig(t, inputsOrder))
  }, [i18n.language, inputsOrder])

  return (
    <div
      className={classNames('Workspace', className)}
      onKeyDown={onContKeyDown}
    >
      <Form className={'Workspace__Form Workspace__Form_general'}>
        <InputRow
          label={t('Year')}
          inputRef={(elem) => (inputRefs.year = elem)}
          name={'year'}
          value={currentYear}
          onChange={(e) => setCurrentYear(parseInt(e.target.value) || '')}
          onBlur={onYearChanged}
          type={'number'}
        />
        <InputRow
          onBlur={onDocumentChanged}
          label={t('Document')}
          inputRef={(elem) => (inputRefs.document = elem)}
          name={'document'}
          type={'number'}
          onChange={(e) => setCurrentDocument(parseInt(e.target.value) || '')}
          value={currentDocument}
        />
      </Form>
      <Form className={'Workspace__Form Workspace__Form_husband'} workspace>
        <FormTitle>{t('Husband')}</FormTitle>
        {mapFieldsToInputs('husband', inputsOrder.husband)}
      </Form>
      <Form className={'Workspace__Form Workspace__Form_wife'} workspace>
        <FormTitle>{t('Wife')}</FormTitle>
        {mapFieldsToInputs('wife', inputsOrder.wife)}
      </Form>
      <ButtonsRow>
        <Button
          className={'Workspace__SaveBtn'}
          label={t('Add')}
          onClick={saveRow}
          btnRef={(elem) => (inputRefs.button = elem)}
          name={'button'}
          center
        />
      </ButtonsRow>
    </div>
  )
}

export default connect(({ inputsOrder, enablePolishLetters }) => ({
  inputsOrder,
  enablePolishLetters,
}))(Workspace)
