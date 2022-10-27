PROJECT_DIR := frontend backend

ifeq ($(OS),Windows_NT)
	build := @$(foreach project,$(PROJECT_DIR),echo "Building $(project)..." & cd ${CURDIR}/$(project) & yarn install --frozen-lockfile &)
	clean := @$(foreach project,$(PROJECT_DIR),echo "Cleaning $(project)..." & rm -r -fo ${CURDIR}/$(project)/node_modules &)
	deploy := @$(foreach project,$(PROJECT_DIR),echo "Deploying $(project)..." & cd ${CURDIR}/$(project) & lc code submit &)
else
	build := @$(foreach project,$(PROJECT_DIR),echo "\nBuilding $(project)..." && yarn install --frozen-lockfile --cwd ${CURDIR}/$(project);)
	clean := @$(foreach project,$(PROJECT_DIR),echo "\nCleaning $(project)..." && rm -rf ${CURDIR}/$(project)/node_modules;)
	deploy := @$(foreach project,$(PROJECT_DIR),echo "\nDeploying $(project)..." && cd ${CURDIR}/$(project) && lc code submit;)
endif

buildAll:
	$(info [*] Building environment for all projects...)
	$(build)
cleanAll:
	$(info [*] Who needs all that anyway? Destroying environment for all projects...)
	$(clean)
deployAll:
	$(info [*] Deploying all projects...)
	$(deploy)
