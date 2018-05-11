import { Intent, Position, Toaster } from "@blueprintjs/core";

const MyToaster = Toaster.create({})

export const showToast = (type, message) => {
  let intent
  let iconName
  message = message.body
  if(type === "info") {
    iconName = "info-sign"
  }
  if(type === "error") {
    intent = Intent.DANGER
    iconName = "warning-sign"
  } else if(type === "warning") {
    // parse(type, message, err)
    intent = Intent.WARNING
    iconName = "warning-sign"
  } else if(type === "success") {
    intent = Intent.SUCCESS
    iconName = "tick-circle"
  }
  MyToaster.show(
    {
      intent,
      position: Position.TOP,
      iconName,
      message
    }
  )
}