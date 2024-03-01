import { SetStateAction } from "react"
import { FieldErrors, FieldValues } from "react-hook-form"


const checkGroup = (
    group: [string, string[]],
    completedSections: (string|boolean)[][],
    setCompleted: {
        (value: SetStateAction<(string | boolean)[][]>): void;
        (arg0: any): void
    },
    dirtyFields:
        Partial<Readonly<{ [x: string]: any }>>,
        errors: FieldErrors<FieldValues>)=> {
            if (group[1]
                .map((value: string)=> {
                    return (dirtyFields[value] != undefined && errors[value]) == undefined
                })
                .reduce((sum, next) => sum && next, true)
            ) {
                if (completedSections.some(item=> item[0] === group[0] && item[1] === false)) {
                    setCompleted(completedSections.map((value, index)=> {
                        return value[0] == group[0] ?
                            value.map((item, index)=>
                                index == 1 ? true : item
                            ) :
                            value
                    }))
                }
            }
            else
                if (completedSections.some(item => item[0] === group[0] && item[1] === true)) {
                    setCompleted(completedSections.map((value, index) => {
                        return value[0] == group[0] ? value.map((item, index) => index == 1 ? false : item) : value
                    }))

                }
}

export default checkGroup