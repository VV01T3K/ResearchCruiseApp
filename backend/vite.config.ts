export default {
  run: {
    tasks: {
      build: {
        command: 'dotnet build ResearchCruiseApp.slnx',
        cache: false,
      },
      check: {
        command:
          'dotnet csharpier check . && dotnet build ResearchCruiseApp.slnx -c Release --no-restore --no-incremental --warnaserror -p:GenerateApiContract=true',
        cache: false,
      },
    },
  },
};
