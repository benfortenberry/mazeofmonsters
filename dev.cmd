@echo off
rem Dev server launcher for Maze of Monsters.
rem Angular 20 needs Node 20.19+, so we pin the bundled Node 20 build here
rem rather than relying on whatever `node` is on your global PATH.
set "PATH=C:\Users\Ben\nodes\node-v20.19.0-win-x64;%PATH%"
cd /d "%~dp0"
echo Using Node:
node --version
echo Starting dev server at http://localhost:4200 ...
call node node_modules\@angular\cli\bin\ng serve --open
