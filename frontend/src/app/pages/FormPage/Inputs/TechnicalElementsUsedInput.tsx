import { Controller, UseFormReturn } from "react-hook-form"
import { ErrorMessageIfPresentNoContext } from "@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext"

export type TechnicalElements = {
  bowStarboard: boolean
  aftStarboard: boolean
  aftPortSide: boolean
  mainCrane: boolean
  bomSTBS: boolean
  bomPS: boolean
  cableRope35kN: boolean
  cableRope5kN: boolean
  mainGantry: boolean
  STBSAuxiliaryGate: boolean
  STBSTrawlElevator: boolean
  PSTrawlElevator: boolean
  workboat: boolean
  observatory: boolean
}

type Props = {
  className: string
  name: string
  form?: UseFormReturn
  history?: TechnicalElements[]
  required?: boolean
  readonly?: boolean
}

export default function TechnicalElementsUsedInput(props: Props) {
  const disabled = props.form!.formState.errors[props.name]?.type == "noEmptyRowFields"

  return (
    <div className={props.className + " p-3"}>
      <Controller
        name={props.name}
        control={props.form!.control}
        defaultValue={[]}
        rules={{
          required: true,
          //row.bowStarboard || row.aftStarboard || row.aftPortSide || row.mainCrane || row.bomSTBS || row.bomPS || row.cableRope35kN || row.cableRope5kN || row.mainGantry || row.STBSAuxiliaryGate || row.STBSTrawlElevator || row.PSTrawlElevator || row.workboat || row.observatory
          validate: {
            noEmptyRowFields: (value: TechnicalElements[]) => {
              for (const row of value) {
                if (
                  row.bowStarboard ||
                  row.aftStarboard ||
                  row.aftPortSide ||
                  row.mainCrane ||
                  row.bomSTBS ||
                  row.bomPS ||
                  row.cableRope35kN ||
                  row.cableRope5kN ||
                  row.mainGantry ||
                  row.STBSAuxiliaryGate ||
                  row.STBSTrawlElevator ||
                  row.PSTrawlElevator ||
                  row.workboat ||
                  row.observatory
                ) {
                  return false
                }
              }
              return false
            },
          },
        }}
        render={({ field }) => (
          <>
            <div className="table-striped w-100">
              <div className="w-100 bg-light">
                {!field.value.length && (
                  <div className="d-flex flex-row justify-content-center bg-light p-2 border">
                    <div className="text-center">Nie dodano tabeli elementów</div>
                  </div>
                )}
                {field.value.map((row: TechnicalElements, index: number) => (
                  <div className="table-striped w-100 bg-primary text-white">
                    <div className={"w-100 d-flex flex-row border flex-wrap p-3"}>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center border bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-4 border h-100 d-xl-flex justify-content-center align-items-center "
                          }
                        >
                          Żurawiki hydrograficzne
                        </div>
                        <div
                          className={
                            "col-8 d-flex flex-row flex-wrap d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          <div
                            className={
                              "col-6 border d-xl-flex justify-content-center align-items-center"
                            }
                          >
                            dziobowy prawa burta
                          </div>
                          <div className={"col-6 border "}>
                            <input
                              type={"checkbox"}
                              {...field}
                              disabled={props.readonly ?? false}
                              checked={row.bowStarboard}
                              onChange={(e) => {
                                row.bowStarboard = e.target.checked
                                props.form?.setValue(props.name, field.value, {
                                  shouldTouch: true,
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                                field.onChange(field.value)
                              }}
                              className={"w-100 h-100"}
                              style={{
                                fontSize: "inherit",
                                resize: "none",
                              }}
                            />
                          </div>
                          <div
                            className={
                              "col-6 border d-xl-flex justify-content-center align-items-center"
                            }
                          >
                            rufowy prawa burta
                          </div>
                          <div className={"col-6 border"}>
                            <input
                              type={"checkbox"}
                              {...field}
                              disabled={props.readonly ?? false}
                              checked={row.aftStarboard}
                              onChange={(e) => {
                                row.aftStarboard = e.target.checked
                                props.form?.setValue(props.name, field.value, {
                                  shouldTouch: true,
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                                field.onChange(field.value)
                              }}
                              className={"w-100 h-100"}
                              style={{
                                fontSize: "inherit",
                                resize: "none",
                              }}
                            />
                          </div>
                          <div
                            className={
                              "col-6 border d-xl-flex justify-content-center align-items-center"
                            }
                          >
                            rufowy lewa burta
                          </div>
                          <div className={"col-6 border"}>
                            <input
                              type={"checkbox"}
                              {...field}
                              disabled={props.readonly ?? false}
                              checked={row.aftPortSide}
                              onChange={(e) => {
                                row.aftPortSide = e.target.checked
                                props.form?.setValue(props.name, field.value, {
                                  shouldTouch: true,
                                  shouldValidate: true,
                                  shouldDirty: true,
                                })
                                field.onChange(field.value)
                              }}
                              className={"w-100 h-100"}
                              style={{
                                fontSize: "inherit",
                                resize: "none",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Dźwig główny
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.mainCrane}
                            onChange={(e) => {
                              row.mainCrane = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                            style={{
                              fontSize: "inherit",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Bom STBS (prawa burta)
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.bomSTBS}
                            onChange={(e) => {
                              row.bomSTBS = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Bom PS (lewa burta)
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.bomPS}
                            onChange={(e) => {
                              row.bomPS = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Kablolina 35 kN
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.cableRope35kN}
                            onChange={(e) => {
                              row.cableRope35kN = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Kablolina 5 kN
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.cableRope5kN}
                            onChange={(e) => {
                              row.cableRope5kN = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                            style={{
                              fontSize: "inherit",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Bramownica główna (rufowa)
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.mainGantry}
                            onChange={(e) => {
                              row.mainGantry = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                            style={{
                              fontSize: "inherit",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Bramownica pomocnicza STBS (prawa burta)
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.STBSAuxiliaryGate}
                            onChange={(e) => {
                              row.STBSAuxiliaryGate = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                            style={{
                              fontSize: "inherit",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Winda trałowa STBS (prawa burta)
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.STBSTrawlElevator}
                            onChange={(e) => {
                              row.STBSTrawlElevator = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                            style={{
                              fontSize: "inherit",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Winda trałowa PS (lewa burta)
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.PSTrawlElevator}
                            onChange={(e) => {
                              row.PSTrawlElevator = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                            style={{
                              fontSize: "inherit",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Łódź robocza
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.workboat}
                            onChange={(e) => {
                              row.workboat = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                            style={{
                              fontSize: "inherit",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                      <div
                        className={
                          "col-12 d-flex flex-row align-items-center justify-content-center bg-secondary"
                        }
                      >
                        <div
                          className={
                            "col-8  border d-xl-flex justify-content-center align-items-center"
                          }
                        >
                          Obserwatorium (bocianie gniazdo)
                        </div>
                        <div className={"col-4  border"}>
                          <input
                            type={"checkbox"}
                            {...field}
                            disabled={props.readonly ?? false}
                            checked={row.observatory}
                            onChange={(e) => {
                              row.observatory = e.target.checked
                              props.form?.setValue(props.name, field.value, {
                                shouldTouch: true,
                                shouldValidate: true,
                                shouldDirty: true,
                              })
                              field.onChange(field.value)
                            }}
                            className={"w-100 h-100"}
                            style={{
                              fontSize: "inherit",
                              resize: "none",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div
                      className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? "d-none" : ""}`}
                    >
                      <div className=" text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                        <button
                          type="button"
                          style={{
                            fontSize: "inherit",
                          }}
                          className={`btn btn-info ${props.readonly ? "d-none" : ""}`}
                          onClick={() => {
                            const val: TechnicalElements[] = field.value

                            val.splice(index, 1)
                            props.form!.setValue(props.name, val, {
                              shouldValidate: true,
                              shouldDirty: true,
                              shouldTouch: true,
                            })
                          }}
                        >
                          Usuń tabelę elementów
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {!disabled && (
              <>
                <div
                  className={`d-flex flex-row flex-wrap justify-content-center w-100 ${props.readonly ? "d-none" : ""}`}
                >
                  <div className="d-flex col-12  text-center pt-2 pb-1 pt-xl-2 pe-xl-2 pb-xl-2 justify-content-center">
                    <button
                      style={{ fontSize: "inherit" }}
                      className={`btn btn-info w-100`}
                      type="button"
                      onClick={() => {
                        const newTechnicalElements: TechnicalElements = {
                          bowStarboard: false,
                          aftStarboard: false,
                          aftPortSide: false,
                          mainCrane: false,
                          bomSTBS: false,
                          bomPS: false,
                          cableRope35kN: false,
                          cableRope5kN: false,
                          mainGantry: false,
                          STBSAuxiliaryGate: false,
                          STBSTrawlElevator: false,
                          PSTrawlElevator: false,
                          workboat: false,
                          observatory: false,
                        }
                        props.form!.setValue(props.name, [...field.value, newTechnicalElements], {
                          shouldValidate: true,
                          shouldDirty: true,
                        })
                        field.onChange([...field.value, newTechnicalElements])
                      }}
                    >
                      Dodaj tabelę elementów
                    </button>
                  </div>
                  {props.form!.formState.errors[props.name] && (
                    <ErrorMessageIfPresentNoContext
                      message={props.form!.formState.errors[props.name]!.message as string}
                    />
                  )}
                </div>
              </>
            )}
          </>
        )}
      />
    </div>
  )
}
