import {Context as ContextTelegraf} from 'telegraf';

export interface StartContext extends ContextTelegraf{
  session:{
    type?: '/start' 
  }
}