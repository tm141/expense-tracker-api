import express from 'express';
import { saveExpenseData, getExpenseData } from '../controllers/expenseController';
import { getCategoryData } from '../controllers/categoryController';
import { expense } from '../model/definition';

const expenseRouter = express.Router();

//read-index
expenseRouter.get('/expenses/', function (req: express.Request, res: express.Response) {
  let data: {}[] = [];
  let temp = JSON.parse(getExpenseData());
  temp.map((expense: expense) => {
    data.push({
      "id": expense.id,
      "name": expense.name,
      "nominal": expense.nominal,
      "date": expense.date
    })
  });
  res.send(data);
});

//read-show
expenseRouter.get('/expenses/:id', function (req: express.Request, res: express.Response) {
  let { id } = req.params;
  let idNum = Number.parseInt(id);
  let data = null;
  let temp = JSON.parse(getExpenseData());
  let categories = JSON.parse(getCategoryData());
  temp.map((expense: expense) => {
    if (expense.id == idNum) {
      data = {
        "id": expense.id,
        "name": expense.name,
        "desc": expense.desc,
        "category": categories[expense.category - 1].name,
        "nominal": expense.nominal,
        "date": expense.date
      };
    }
  });
  if (data) {
    res.send(data);
  } else {
    res.status(404).send("Error 404 - Data not Found");
  }
});

//create
expenseRouter.post('/expenses/', function (req: express.Request, res: express.Response) {
  let tempData = JSON.parse(getExpenseData());

  let maxId = Number.MIN_SAFE_INTEGER;

  tempData.forEach((element:expense) => {
    if(element.id>maxId){
      maxId=element.id;
    }
  });

  let tempReq: expense = {
    "id": (maxId + 1),
    "name": req.body.name,
    "desc": req.body.desc,
    "category": Number.parseInt(req.body.category),
    "nominal": req.body.nominal,
    "date": new Date()
  }
  tempData.push(tempReq);
  saveExpenseData(tempData);
  res.status(201).send({ success: true, msg: 'expenses added succesfully' });
});

//update
expenseRouter.put('/expenses/:id', function(req: express.Request, res: express.Response){
  let { id } = req.params;
  let idNum = Number.parseInt(id);
  let tempData = JSON.parse(getExpenseData());
  tempData.forEach((element:expense) => {
    if(idNum == element.id){
      if(req.body.name){
        element.name=req.body.name;
      }
      if(req.body.desc){
        element.desc= req.body.desc;
      }
      if(req.body.category){
        element.category= req.body.category;
      }
      if(req.body.nominal){
        element.nominal= req.body.nominal;
      }
    }
  });
  saveExpenseData(tempData);
  res.status(200).send({ success: true, msg: 'expenses edited succesfully' });
})

//delete
expenseRouter.delete('/expenses/:id', function(req: express.Request, res: express.Response){
  let { id } = req.params;
  let idNum = Number.parseInt(id);
  let tempData = JSON.parse(getExpenseData());
  let output:expense[] = []
  tempData.forEach((element:expense) => {
    if(idNum != element.id){
      output.push({
        "id": element.id,
        "name": element.name,
        "desc": element.desc,
        "category": element.category,
        "nominal": element.nominal,
        "date": element.date
      })
    }
  });
  saveExpenseData(JSON.parse(JSON.stringify(output)));
  res.status(200).send({ success: true, msg: 'expenses deleted succesfully' });
})

//get total expenses by date range
expenseRouter.get('/expenses/total/startDate/:startDate/endDate/:endDate', function(req: express.Request, res: express.Response){
  let startDate = new Date(String(req.params.startDate));
  let endDate = new Date(String(req.params.endDate));
  let tempData = JSON.parse(getExpenseData());
  let total = 0;
  tempData.forEach((element:expense) => {
    let elementDate = new Date(element.date);
    if(elementDate>startDate && elementDate<endDate){
      total+= Number(element.nominal);
    }
  });
  res.status(200).send({ total: total });
})

//get total expenses by category
expenseRouter.get('/expenses/total/category/:category', function(req: express.Request, res: express.Response){
  let categoryTemp = req.params.category;
  let tempData = JSON.parse(getExpenseData());
  let total = 0;
  tempData.forEach((element:expense) => {
    if(element.category==Number(categoryTemp)){
      total+= Number(element.nominal);
    }
  });
  res.status(200).send({ total: total });
})

export default expenseRouter;

