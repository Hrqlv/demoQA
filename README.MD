# DemoQA Automation Tests

### Clone Project 

```
git clone https://github.com/Hrqlv/demoQA.git
```
### Install dependencies

```
npm install
```

### Install Playwright 

```
npx playwright install
```

## How run the tests

### Running all tests
```
npm run tests
```

### Running tests on a expecific browser
```
npm run chrome
```
#### Options:
- chrome
- safari
- firefox


### Running API Tests
```
npm run api
```
### Running BOOKS Tests
```
npm run books
```

### Running a test by Tag
```
npm run tests -- --grep @BOOKS
npm run tests -- --grep @API
```

#### Example Options:
- @API - Run tests with API tag
- @BOOKS - Run tests with BOOKS tag

### Running tests in headed mode (it will open the browser)
```
npm run headed
```

## Debugging tests

### Debugging all tests (It will open the playwright debug window)
```
npm run debug
```

### Debugging a test by Tag with a specific browser
```
npm run chrome -- --debug --grep @API
npm run chrome -- --debug --grep @BOOKS
```

### Show test report
```
npx playwright show-report
```
