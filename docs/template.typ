#let template(name, doc) = {
  set text(
    font: "New Computer Modern",
    size: 12pt,
  )

  align(center + horizon)[
    #context [
      #set par(justify: false)

      #text(size: 25pt)[
        *ResearchCruiseApp*
      ]

      #text(size: 20pt)[
        #name
      ]

      #datetime.today().display()
    ]

    #v(10cm)

    #grid(
      columns: (auto, 1fr, auto),
      gutter: 10pt,
      [Stanisław Nieradko], [], [s193044],
      [Krzysztof Nasuta], [], [s193328],
      [Paweł Pstrągowski], [], [s193473],
      [Bartłomiej Krawisz], [], [s193319],
      [Filip Dawidowski], [], [s193433],
    )
  ]

  set page(
    paper: "a4",
    margin: (x: 1cm, y: 2cm),
    numbering: "1",
    header: [
      #grid(
        columns: (auto, 1fr, auto),
        [*ResearchCruiseApp* - #name], [], datetime.today().display(),
      )
      #line(length: 100%)
    ],
  )

  pagebreak()

  doc
}
