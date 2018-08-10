echo -e "\n **-------- RELEASE TASK --------** \n"

echo -e "after_success::release-package --> Building release pkg. \n"

# copy extra release files into the build directory
cp $TRAVIS_BUILD_DIR/package.json $TRAVIS_BUILD_DIR/build/saij/
cp $TRAVIS_BUILD_DIR/package-lock.json $TRAVIS_BUILD_DIR/build/saij/
cp $TRAVIS_BUILD_DIR/CHANGELOG.md $TRAVIS_BUILD_DIR/build/saij/
cp $TRAVIS_BUILD_DIR/README.md $TRAVIS_BUILD_DIR/build/saij/
cp $TRAVIS_BUILD_DIR/LICENSE $TRAVIS_BUILD_DIR/build/saij/

echo -e "Copied build: .git, package.json, LICENSE and CHANGELOG.md to $TRAVIS_BUILD_DIR/build/saij/ \n"

echo -e "after_success::release-publish --> Publishing semver. \n"

echo -e "------- RELEASE DIR ------- \n"
ls -al $TRAVIS_BUILD_DIR/build/saij/

echo -e "Running semantic-release! \n"
# run semantic release
# this will generate changelog and package.json version bump
npm run travis-deploy-once "npm run semantic-release"

echo -e "\n ------- RELEASED BUMPS ------- \n"
cat $TRAVIS_BUILD_DIR/build/saij/package.json
cat $TRAVIS_BUILD_DIR/build/saij/CHANGELOG.md

echo -e "\n Successfully ran semantic-release \n"

echo -e "after_success::release-merge --> Re-merging release into master. \n"

echo -e "Building $BRANCH to merge into branch $TRAVIS_BRANCH \n"

if [ "$TRAVIS_BRANCH" == "master" ] && [ "$BRANCH" == "master" ]
then
  echo -e "This is a MASTER MERGE! \n"

  cd $HOME
  git config --global user.email "admin@skan.io"
  git config --global user.name "Skan.io Admin (Travis)"

  # Clone the repository in the folder master
  git clone https://skan-io:$GITHUB_API_KEY@github.com/skan-io/saij master

  # copy generated files from build folder back to package root
  cp $TRAVIS_BUILD_DIR/build/saij/package.json $HOME/master/
  cp -R $TRAVIS_BUILD_DIR/node_modules/ $HOME/master/

  cd $HOME/master

  npm install -g conventional-changelog-cli
  conventional-changelog -p angular -i CHANGELOG.md -s -r 0

  echo -e "\n Copied release files and node_modules into $HOME/master/ \n"

  echo -e "------- MASTER FILES ------- \n"
  ls -al .

  npm run docs

  echo -e "\n Successfully rebuilt docs with current version \n"

  # add, commit and push files
  git add -A
  git commit -m "ci(Travis): $TRAVIS_BUILD_NUMBER pushed release to master [skip ci]"
  git push origin master -f

  echo -e "\n Successfully pushed release version and changelog to saij master \n"
  echo 'Release stage complete!';
  exit 0;
fi
echo 'No release steps required, this is NOT A MASTER MERGE.';
exit 0;
