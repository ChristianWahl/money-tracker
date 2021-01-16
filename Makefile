lint-docker:
	hadolint Dockerfile

all: lint-docker
