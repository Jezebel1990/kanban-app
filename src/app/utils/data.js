export const id = () => Math.random().toString(36).substring(2, 10);

export const data = {
    "boards": [
      {
        id: id(),
        name: "Roadmap",
        columns: [
          {
            id: id(),
            name: "Agora",
            tasks: [
              {
                id: id(),
                title: "Lançar primeira versão",
                status: "Agora"
              },
              {
                id: id(),
                title: "Revise o feedback inicial e planeje as próximas etapas.",
                status: "Agora"
              }
            ]
          },
          {
            id: id(),
            name: "Próxima",
            tasks: []
          },
          {
            id: id(),
            name: "Futuramente",
            tasks: []
          }
        ]
      }
    ]
  }