import React from "react"
import ReactHtmlParser from 'react-html-parser'

const Form = (job) => {
  const jobQuestions = job.questions
  const locationQuestions = (job.location_questions) ? job.location_questions : []
  const questions = [...jobQuestions, ...locationQuestions]

  return (
    <form name="contact" method="POST" data-netlify="true">
      {questions.map((question, index) =>
        <FieldLayout question={question} key={index} />
      )}
      <button type="submit">Submit Application</button>
    </form>
  )
}

export default Form

const FieldLayout = ({question}) => {
  const [field] = question.fields
  const isHiddenField = Boolean(field.type === 'input_hidden')

  if (isHiddenField) {
    return (
      <React.Fragment>
        {question.fields.map((field, index) =>
          <FormField key={index.toString()} field={field} requiredString={question.required} />
        )}
      </React.Fragment>
    )
  }

  return (
    <div className='field-layout'>
      <label>
        <span>{question.label}</span>
        {Boolean(question.required) &&
          <span className='required'>*</span>
        }
      </label>
      {Boolean(question.description) &&
        <div className='description'>{ReactHtmlParser(question.description)}</div>
      }
      {question.fields.map((field, index) =>
        <FormField key={index.toString()} field={field} requiredString={question.required} />
      )}
    </div>
  )
}

const FormField = ({field, requiredString}) => {
  const props = {
    name: field.name,
    values: Boolean(field.values && field.values.length) ? field.values : null,
    required: Boolean(requiredString)
  }

  const FIELD_TYPES = {
    'input_hidden' : <FieldInputHidden {...props} />,
    'input_text' : <FieldInputText {...props} />,
    'input_file' : <FieldInputFile {...props} />,
    'textarea' : <FieldTextArea {...props} />,
    'multi_value_single_select' : <MultiValueSingleSelect {...props} />,
    'multi_value_multi_select' : <FieldSelectCheckboxes {...props} />
  }

  if (field.type in FIELD_TYPES) {
    return FIELD_TYPES[field.type]
  }

  return null
}

const FieldInputHidden = ({name}) => {
  return (
    <input type="hidden" id={name} name={name} />
  )
}

const FieldInputText = ({name, required}) => {
  return (
    <input type="text" id={name} name={name} required={required} />
  )
}

const FieldInputFile = ({name, required}) => {
  return (
    <div className="file-upload-layout">
      <input type="file" id={name} name={name} required={required} accept=".doc,.docx,.pdf,.rtf,.txt" />
      <div class="file-upload-message">File can be .doc(x), .pdf, .rtf, or .txt.</div>
    </div>
  )
}

const FieldTextArea = ({name, required}) => {
  return (
    <textarea id={name} name={name} required={required} />
  )
}

const MultiValueSingleSelect = (props) => {
  const { values } = props
  return (values.length > 4) ? (
    <FieldSelectOptions {...props} />
  ) : (
    <FieldSelectRadios {...props} />
  )
}

const FieldSelectOptions = ({name, values, required}) => {
  return (
    <select id={name} name={name} required={required}>
      <option value="">Please Select</option>
      {values.map((value, index) => (
        <option key={index.toString()} value={value.value}>{value.label}</option>
      ))}
    </select>
  )
}

const FieldSelectRadios = ({name, values, required}) => {
  return (
    <div className='radios'>
      {values.map((value, index) => (
        <label key={index.toString()}>
          <input type="radio" name={name} value={value.value} required={required} />
          <span>{value.label}</span>
        </label>
      ))}
    </div>
  )
}

const FieldSelectCheckboxes = ({name, values, required}) => {
  return (
    <div className='checkboxes'>
      {values.map((value, index) => (
        <label key={index.toString()}>
          <input type="checkbox" name={name} value={value.value} required={required} />
          <span>{value.label}</span>
        </label>
      ))}
    </div>
  )
}